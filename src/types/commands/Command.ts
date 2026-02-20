/**
 * @file Command.ts
 * @description Exports all types and interfaces used in client command builder.
 * @author Lucas
 * @license MIT
 */

import type {
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
    PermissionResolvable,
    SlashCommandBuilder,
    Awaitable
} from 'discord.js';
import type { PixeL } from '@/structures/client/ClientBuilder';
import type { CommandContext } from './CommandContext';

/**
 * Represents a command usage example.
 */
interface CommandUsageExample {
    /** Description of the example */
    description?: string;

    /** Usage example */
    usage?: string;
}

/**
 * Represents command usage metadata.
 */
interface CommandUsageMetadata {
    /** A brief description of how use the command */
    summary: string;

    /** A list of usage examples */
    examples?: CommandUsageExample;

    /** Notes for user when using command */
    notes?: string[];

    /** A list of related commands */
    relatedCommands?: string[];
}

/**
 * Command metadata information.
 */
export interface CommandMetadata {
    /** Other ways to call the command when running via message */
    aliases?: string[];

    /** Command applicable categories */
    categories?: string[];

    /** Date of command creation */
    createdAt?: string;

    /** Command backstory */
    backstory?: string;

    /** Command usage information */
    usage?: CommandUsageMetadata;

    /** Short waiting time between the execution of this command and the next */
    cooldown?: string | number;

    /** User's and client's permissions needed to run this command in a guild */
    userPermissions?: PermissionResolvable;
    botPermissions?: PermissionResolvable;

    /** Wheter only the guild owner can run this command */
    ownerOnly?: boolean;

    /** Wheter only users with dev permission can run this command */
    devOnly?: boolean;
}

/**
 * Type for bot commands data.
 * @remarks Data defined with this will be used for both slash and prefix commands.
 */
export type CommandData =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;

/** Type for command execute function annotation */
export type CommandExecute = (client: PixeL, context: CommandContext) => Awaitable<void>;

/**
 * The bot command interface.
 */
export interface Command {
    /** Command data */
    readonly data: Readonly<CommandData>;

    /** Command metadata */
    readonly metadata: Readonly<CommandMetadata>;

    /** Command execution function */
    readonly execute: CommandExecute;
}
