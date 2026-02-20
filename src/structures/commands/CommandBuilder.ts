/**
 * @file CommandBuilder.ts
 * @description Command builder for client commands.
 * @author Lucas
 * @license MIT
 */

import { CommandMetadata, CommandExecute, CommandData, Command } from '@/types';

/**
 * Implementation of the {@link Command} interface.
 * @implements {Command}
 */
export class CommandBuilder implements Command {
    public readonly data: Readonly<CommandData>;
    public readonly metadata: Readonly<CommandMetadata>;
    public readonly execute: CommandExecute;

    /**
     * Builds the command with provided configurations.
     * @param command - The command properties to initialize builder with.
     */
    constructor({ data, metadata, execute }: Command) {
        this.data = Object.freeze(data);
        this.metadata = Object.freeze(metadata);
        this.execute = execute;
    }
}
