/**
 * @file CommandContext.ts
 * @description Exports all types and interfaces for command context builder.
 * @author Lucas
 * @license MIT
 */

import { ChatInputCommandInteraction, Message } from 'discord.js';
import { PixeL } from '@/structures/client/ClientBuilder';
import { I18nProviderInterface } from '@/lib/i18n';
import { Command } from './Command';

/** The type of interaction that triggered the creation of the content */
export type CommandContextType = 'slash' | 'prefix';

/** The context interaction source */
export type CommandContextSource = ChatInputCommandInteraction | Message;

/**
 * The discord bot command context.
 */
export interface CommandContext {
    /** Context type */
    readonly type: CommandContextType;

    /** Context source */
    readonly source: CommandContextSource;

    /** Triggered command */
    readonly command: Command;

    /** Context localization service */
    readonly i18n: I18nProviderInterface;

    /** Context discord client */
    readonly client: PixeL;
}
