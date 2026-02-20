/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { PROJECT_PATHS } from '@/config/constants';
import { join } from 'node:path';

const { distribution, source } = PROJECT_PATHS;

/**
 * Abstract class for all application environment
 * variables manager
 */
export abstract class BaseEnvironment {
    /**
     * Parses a string into a valid path
     *
     * @param value - The string value to convert to a valid path.
     *
     * @returns Parsed path from environment string value
     */
    protected parsePath(value: string): string {
        return join(
            process.cwd(),
            process.env.NODE_ENV === 'prod'
                ? value.replace(`${source}/`, `${distribution}/`).slice(0, -3) + '.js'
                : value
        );
    }

    /**
     * Retrieves a raw environment variable value as string.
     * Does not perform any type conversion.
     *
     * @param key - The name of the environment variable.
     *
     * @throws {Error} If the environment variable is missing.
     *
     * @returns The raw string value.
     */
    protected getRawValue(key: string): string {
        const value = process.env[key];

        if (!value) throw new Error(`Missing required environment variable: ${key}`);

        return value;
    }

    /**
     * Retrieves an optional raw environment variable value.
     *
     * @param key - The name of the environment variable.
     * @param defaultValue - Value returned if env key does not exist.
     *
     * @returns The raw string value or default.
     */
    protected getOptionalRawValue(key: string, defaultValue: string | null = null): string | null {
        return process.env[key] ?? defaultValue;
    }

    /**
     * Retrieves an environment variable as string.
     */
    protected getString(key: string): string {
        return this.getRawValue(key);
    }

    /**
     * Retrieves an environment variable as integer.
     */
    protected getInt(key: string): number {
        return parseInt(this.getRawValue(key), 10);
    }

    /**
     * Retrieves an environment variable as float.
     */
    protected getFloat(key: string): number {
        return parseFloat(this.getRawValue(key));
    }

    /**
     * Retrieves an environment variable as boolean.
     * Accepts: "true", "1"
     */
    protected getBool(key: string): boolean {
        const value = this.getRawValue(key);

        return value === 'true' || value === '1';
    }

    /**
     * Converts a list in string format obtained from the environment configuration file to a JS array
     *
     * @param key - The environment variable key.
     * @param cb - Optional callback to parse each entry.
     *
     * @returns Parsed array from environment key
     */
    protected getArrayValue(key: string, cb?: (part: string) => string): string[] {
        return this.getRawValue(key)
            .split(',')
            .map((part) => (cb ? cb(part.trim()) : part.trim()));
    }

    /**
     * Gets an environment directory path variable
     *
     * @param key - The environment variable key
     *
     * @returns The parsed path
     */
    protected getPath(key: string): string {
        return this.parsePath(this.getRawValue(key));
    }
}
