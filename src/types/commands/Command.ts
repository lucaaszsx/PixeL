import type {
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
    PermissionResolvable,
    SlashCommandBuilder
} from "discord.js";
import type { PixeL as PixeLClient } from "@/structures/client/ClientBuilder";
import type { CommandContext } from './CommandContext';

export interface CommandUsageMetadata {
    summary: string;

    examples?: {
        description?: string;
        usage?: string;
    };

    notes?: string[];
    relatedCommands?: string[];
}

export interface CommandMetadata {
    aliases?: string[];
    categories?: string[];
    createdAt?: string;
    backstory?: string;
    usage?: CommandUsageMetadata;
    cooldown?: string | number;
    userPermissions?: PermissionResolvable;
    botPermissions?: PermissionResolvable;
    ownerOnly?: boolean;
    devOnly?: boolean;
}

export type SlashBuilder =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;

export interface Command {
    data: SlashBuilder;
    metadata: CommandMetadata;

    execute(client: PixeLClient, context: CommandContext): Promise<void>;
}