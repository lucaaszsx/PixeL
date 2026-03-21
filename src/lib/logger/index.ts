/**
 * @file Logger.ts
 * @description Provides scoped logging with support for multiple log levels and path-based scope formatting.
 * @author Lucas
 * @license MIT
 */

import { PROJECT_PATHS } from '@/config/constants';
import winston from 'winston';
import path from 'node:path';
import chalk from 'chalk';

/**
 * Interface representing the logger structure
 */
export interface LoggerInterface {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    http(message: string, ...args: any[]): void;
}

/**
 * Enum representing available logger levels.
 */
export enum LoggerLevels {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    HTTP = 'http'
}

/**
 * Logger class that wraps Winston for structured and scoped logging.
 */
export class Logger implements LoggerInterface {
    public static DEFAULT_SCOPE = 'app';

    /**
     * Transforms a file path into a readable scope string.
     *
     * @param filepath - Absolute or relative path of the file
     * @returns Formatted scope string
     */
    private static parsePathToScope(filepath: string): string {
        if (filepath.indexOf(path.sep) >= 0)
            filepath = filepath
                .replace(process.cwd(), '')
                .replace(`${path.sep}${PROJECT_PATHS.source}${path.sep}`, '')
                .replace(`${path.sep}${PROJECT_PATHS.distribution}${path.sep}`, '')
                .replace('.ts', '')
                .replace('.js', '')
                .replace(new RegExp(path.sep, 'g'), ':');

        return filepath;
    }

    /** Holds the formatted scope of the logger instance. */
    private scope: string;

    /**
     * Creates a new Logger instance with optional scope.
     * If no scope is provided, uses DEFAULT_SCOPE.
     *
     * @param scope - Optional scope, typically the current file's `__filename`
     */
    constructor(scope?: string) {
        this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
    }

    /**
     * Logs a debug-level message.
     *
     * @param message - Message to log
     * @param args - Additional arguments (e.g., metadata)
     */
    public debug(message: string, ...args: any[]): void {
        this.log(LoggerLevels.DEBUG, message, args);
    }

    /**
     * Logs an info-level message.
     *
     * @param message - Message to log
     * @param args - Additional arguments (e.g., metadata)
     */
    public info(message: string, ...args: any[]): void {
        this.log(LoggerLevels.INFO, message, args);
    }

    /**
     * Logs a warning-level message.
     *
     * @param message - Message to log
     * @param args - Additional arguments (e.g., metadata)
     */
    public warn(message: string, ...args: any[]): void {
        this.log(LoggerLevels.WARN, message, args);
    }

    /**
     * Logs an error-level message.
     *
     * @param message - Message to log
     * @param args - Additional arguments (e.g., metadata)
     */
    public error(message: string, ...args: any[]): void {
        this.log(LoggerLevels.ERROR, message, args);
    }

    /**
     * Logs an http-level message.
     *
     * @param message - Message to log
     * @param args - Additional arguments (e.g., metadata)
     */
    public http(message: string, ...args: any[]): void {
        this.log(LoggerLevels.HTTP, message, args);
    }

    /**
     * Internal method to send a log message to Winston with proper scope formatting.
     *
     * @param level - Logging level from LoggerLevels
     * @param message - Message to log
     * @param args - Additional arguments
     */
    private log(level: LoggerLevels, message: string, args: any[]): void {
        if (Object.prototype.hasOwnProperty.call(winston, level))
            (winston as any)[level](`${this.formatScope()} ${message}`, args);
    }

    /**
     * Formats the scope string for consistent log prefixing.
     *
     * @returns Scope wrapped in brackets (e.g., `[auth:controller]`)
     */
    private formatScope(): string {
        return chalk.hex('#9713cbff')(`[${this.scope}]`);
    }
}