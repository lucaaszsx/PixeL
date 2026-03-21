/**
 * @file CommandArguments.ts
 * @description Unified argument resolver for both slash and prefix commands,
 *              using SlashCommandBuilder options as the single source of truth.
 * @author Lucas
 * @license MIT
 */

import {
    type GuildBasedChannel,
    type User,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    GuildMember,
    Collection,
    Message,
    Role,
} from "discord.js";
import type { CommandContext } from "@/types";

/** All supported resolved argument types */
export type ArgumentType = string | number | boolean | User | GuildMember | GuildBasedChannel | Role;

/** A single resolved argument entry */
export interface ResolvedArgument {
    name: string;
    value: ArgumentType | null;
}

/** Represents a normalized slash command option used for parsing */
interface NormalizedOption {
    name: string;
    type: ApplicationCommandOptionType;
    required: boolean;
}

/** Mention regex patterns for resolving raw Discord mentions */
const MENTION_PATTERNS = {
    user:    /^<@!?(\d+)>$/,
    channel: /^<#(\d+)>$/,
    role:    /^<@&(\d+)>$/,
} as const;

/** Option types treated as long text (STRING) */
const STRING_TYPES = new Set([
    ApplicationCommandOptionType.String,
]);

/** Option types resolved via mention or ID */
const RESOLVABLE_TYPES = new Set([
    ApplicationCommandOptionType.User,
    ApplicationCommandOptionType.Channel,
    ApplicationCommandOptionType.Role,
    ApplicationCommandOptionType.Mentionable,
]);

/** Option types treated as numeric */
const NUMERIC_TYPES = new Set([
    ApplicationCommandOptionType.Number,
    ApplicationCommandOptionType.Integer,
]);

/**
 * Resolves and normalizes arguments from both slash and prefix command sources
 * into a unified collection, using SlashCommandBuilder options as the source of truth.
 */
export class CommandArgumentsBuilder {
    private readonly resolved: Collection<string, ResolvedArgument>;

    constructor(context: CommandContext) {
        this.resolved = context.source instanceof Message
            ? CommandArgumentsBuilder.resolveFromMessage(context)
            : CommandArgumentsBuilder.resolveFromInteraction(context.source);
    }

    // Extracts and normalizes options from the command data
    private static getNormalizedOptions(context: CommandContext): NormalizedOption[] {
        const json = context.command.data.toJSON();

        return (json.options ?? [])
            .filter((option) =>
                'type' in option &&
                option.type !== ApplicationCommandOptionType.Subcommand &&
                option.type !== ApplicationCommandOptionType.SubcommandGroup
            )
            .map((option) => ({
                name: option.name,
                type: option.type as ApplicationCommandOptionType,
                required: 'required' in option ? !!option.required : false
            }))
    }

    // Splits message content into non-string tokens and pipe-delimited string segments
    private static splitMessageParts(content: string): { tokens: string[]; segments: string[] } {
        const [commandPart, ...rest] = content.trim().split(/\s+/);
        void commandPart;

        const fullRest = rest.join(' ');
        const pipeIndex = fullRest.indexOf('|');

        if (pipeIndex === -1) {
            return { tokens: rest, segments: [] };
        }

        const tokensPart = fullRest.slice(0, pipeIndex).trim();
        const segmentsPart = fullRest.slice(pipeIndex + 1);

        return {
            tokens: tokensPart ? tokensPart.split(/\s+/) : [],
            segments: segmentsPart.split('|').map(s => s.trim()),
        };
    }

    // Resolves a raw token into a User, GuildMember, GuildBasedChannel, or Role
    private static resolveEntity(
        raw: string,
        type: ApplicationCommandOptionType,
        message: Message,
        context: CommandContext
    ): User | GuildMember | GuildBasedChannel | Role | null {
        const userMatch = raw.match(MENTION_PATTERNS.user);
        const channelMatch = raw.match(MENTION_PATTERNS.channel);
        const roleMatch = raw.match(MENTION_PATTERNS.role);
        const isId = /^\d+$/.test(raw);

        if (type === ApplicationCommandOptionType.User || type === ApplicationCommandOptionType.Mentionable) {
            const id = userMatch?.[1] ?? (isId ? raw : null);
            if (!id) return null;
            return message.guild?.members.cache.get(id) ?? context.client.users.cache.get(id) ?? null;
        }

        if (type === ApplicationCommandOptionType.Channel) {
            const id = channelMatch?.[1] ?? (isId ? raw : null);
            if (!id) return null;
            return (message.guild?.channels.cache.get(id) as GuildBasedChannel) ?? null;
        }

        if (type === ApplicationCommandOptionType.Role) {
            const id = roleMatch?.[1] ?? (isId ? raw : null);
            if (!id) return null;
            return message.guild?.roles.cache.get(id) ?? null;
        }

        return null;
    }

    // Resolves a raw token into a number, or null if not convertible
    private static resolveNumber(raw: string, type: ApplicationCommandOptionType): number | null {
        const parsed = Number(raw);
        if (isNaN(parsed)) return null;
        if (type === ApplicationCommandOptionType.Integer && !Number.isInteger(parsed)) return null;
        return parsed;
    }

    // Resolves a raw token into a boolean, or null if not convertible
    private static resolveBoolean(raw: string): boolean | null {
        if (raw === 'true') return true;
        if (raw === 'false') return false;
        return null;
    }

    // Resolves raw message content into named arguments using command options as source of truth
    private static resolveFromMessage(context: CommandContext): Collection<string, ResolvedArgument> {
        const collection = new Collection<string, ResolvedArgument>();
        const message = context.source as Message;
        const options = CommandArgumentsBuilder.getNormalizedOptions(context);

        const stringOptions = options.filter(o => STRING_TYPES.has(o.type));
        const nonStringOptions = options.filter(o => !STRING_TYPES.has(o.type));
        const hasMultipleStrings = stringOptions.length >= 2;

        const { tokens, segments } = CommandArgumentsBuilder.splitMessageParts(message.content);

        // Resolve non-string options positionally from tokens
        for (const [index, option] of nonStringOptions.entries()) {
            const raw = tokens[index] ?? null;
            let value: ArgumentType | null = null;

            if (raw !== null) {
                if (RESOLVABLE_TYPES.has(option.type)) {
                    value = CommandArgumentsBuilder.resolveEntity(raw, option.type, message, context);
                } else if (NUMERIC_TYPES.has(option.type)) {
                    value = CommandArgumentsBuilder.resolveNumber(raw, option.type);
                } else if (option.type === ApplicationCommandOptionType.Boolean) {
                    value = CommandArgumentsBuilder.resolveBoolean(raw);
                }
            }

            collection.set(option.name, { name: option.name, value });
        }

        // Resolve string options
        if (hasMultipleStrings) {
            // Each string option maps to a pipe-delimited segment
            for (const [index, option] of stringOptions.entries()) {
                const value = segments[index]?.trim() || null;
                collection.set(option.name, { name: option.name, value });
            }
        } else if (stringOptions.length === 1) {
            // Single string option captures the rest of the tokens after non-string args
            const restTokens = tokens.slice(nonStringOptions.length);
            const value = restTokens.length > 0 ? restTokens.join(' ') : null;
            collection.set(stringOptions[0].name, { name: stringOptions[0].name, value });
        }

        return collection;
    }

    // Resolves slash command options into the unified format
    private static resolveFromInteraction(
        interaction: ChatInputCommandInteraction
    ): Collection<string, ResolvedArgument> {
        const collection = new Collection<string, ResolvedArgument>();

        for (const option of interaction.options.data) {
            const value =
                (option.member as GuildMember | undefined) ??
                option.user ??
                (option.role as Role | undefined) ??
                (option.channel as GuildBasedChannel | undefined) ??
                option.value ??
                null;

            collection.set(option.name, { name: option.name, value: value as ArgumentType | null });
        }

        return collection;
    }

    /** Returns the resolved argument by name, or null if not found */
    public get(name: string): ResolvedArgument | null {
        return this.resolved.get(name) ?? null;
    }

    /** Returns the resolved argument by position index, or null if not found */
    public at(index: number): ResolvedArgument | null {
        return this.resolved.at(index) ?? null;
    }

    /** Returns the argument value as string, or null if not found or wrong type */
    public getString(name: string): string | null {
        const arg = this.get(name);
        return typeof arg?.value === 'string' ? arg.value : null;
    }

    /** Returns the argument value as number, or null if not convertible */
    public getNumber(name: string): number | null {
        const arg = this.get(name);
        if (!arg) return null;
        if (typeof arg.value === 'number') return arg.value;
        if (typeof arg.value === 'string') {
            const parsed = Number(arg.value);
            return isNaN(parsed) ? null : parsed;
        }
        return null;
    }

    /** Returns the argument value as boolean, or null if not convertible */
    public getBoolean(name: string): boolean | null {
        const arg = this.get(name);
        if (!arg) return null;
        if (typeof arg.value === 'boolean') return arg.value;
        if (typeof arg.value === 'string') {
            if (arg.value === 'true') return true;
            if (arg.value === 'false') return false;
        }
        return null;
    }

    /** Returns the argument value as User, or null if not a User */
    public getUser(name: string): User | null {
        const arg = this.get(name);
        if (!arg) return null;
        if (arg.value instanceof GuildMember) return null;
        return arg.value instanceof Object && 'username' in arg.value ? arg.value as User : null;
    }

    /** Returns the argument value as GuildMember, or null if not a GuildMember */
    public getMember(name: string): GuildMember | null {
        const arg = this.get(name);
        return arg?.value instanceof GuildMember ? arg.value : null;
    }

    /** Returns the argument value as GuildBasedChannel, or null if not a channel */
    public getChannel(name: string): GuildBasedChannel | null {
        const arg = this.get(name);
        return arg?.value instanceof Object && 'guild' in arg.value && 'send' in arg.value
            ? arg.value as GuildBasedChannel
            : null;
    }

    /** Returns the argument value as Role, or null if not a Role */
    public getRole(name: string): Role | null {
        const arg = this.get(name);
        return arg?.value instanceof Role ? arg.value : null;
    }

    /**
     * Asserts that an argument exists and its value is non-null.
     * @throws {Error} if the argument is missing or null
     */
    public require<T extends ArgumentType>(name: string): T {
        const arg = this.get(name);
        if (!arg || arg.value === null) throw new Error(`Missing required argument: "${name}"`);
        return arg.value as T;
    }

    /** Returns whether an argument exists and has a non-null value */
    public has(name: string): boolean {
        return (this.resolved.get(name)?.value ?? null) !== null;
    }

    /** Returns the total number of resolved arguments */
    public get size(): number {
        return this.resolved.size;
    }
}