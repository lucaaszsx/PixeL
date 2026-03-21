/**
 * @file CommandContextBuilder.ts
 * @description Command context builder for client commands.
 * @author Lucas
 * @license MIT
 */

import {
    type TextBasedChannel,
    type Snowflake,
    type Guild,
    type User,
    GuildMember,
    Message
} from 'discord.js';
import type {
    CommandContextSource,
    CommandContextType,
    CommandContext,
    Command
} from '@/types';
import { type I18nProviderInterface, I18nProvider } from '@/lib/i18n';
import { CommandArgumentsBuilder } from './CommandArgumentsBuilder';
import type { PixeL } from '../client/ClientBuilder';

/**
 * Implementation of the {@link CommandContext} interface.
 * @implements {CommandContext}
 */
export class CommandContextBuilder implements CommandContext {
    public readonly type: CommandContextType;
    public readonly source: CommandContextSource;
    public readonly command: Command;
    public readonly args: CommandArgumentsBuilder;
    public readonly client: PixeL;
    public readonly i18n: I18nProviderInterface;

    constructor({ type, source, command, client }: CommandContext) {
        this.type = type;
        this.source = source;
        this.command = command;
        this.args = new CommandArgumentsBuilder(this);
        this.client = client;

        // TO-DO: add database user locale preference here
        const locale = this.guild?.preferredLocale;

        this.i18n = new I18nProvider(locale);
    }

    public get id(): Snowflake {
        return this.source.id;
    }

    public get user(): User {
        return this.source instanceof Message ? this.source.author : this.source.user;
    }

    public get guild(): Guild | null {
        return this.source.guild;
    }

    public get channel(): TextBasedChannel | null {
        const { channel } = this.source;

        return channel?.isTextBased() ? channel : null;
    }

    public get content(): string | null {
        return this.source instanceof Message ? this.source.content : null;
    }

    public async getMember(force: boolean = false): Promise<GuildMember | null> {
        if (!this.guild) return Promise.resolve(null);
        if (force) return this.guild.members.fetch(this.user.id).catch((): null => null);
        if (this.source instanceof Message) return Promise.resolve(this.source.member ?? null);

        const { member } = this.source;
        if (member instanceof GuildMember) return Promise.resolve(member);

        return this.guild.members.fetch(this.user.id).catch((): null => null);
    }
}
