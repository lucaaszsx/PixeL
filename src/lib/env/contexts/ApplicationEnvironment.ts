/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { BaseEnvironment } from './BaseEnvironment';

export class ApplicationEnvironment extends BaseEnvironment {
    /**
     * Node environment getters
     */
    public get nodeEnv(): string {
        return this.getString('NODE_ENV');
    }

    public get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    public get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    /**
     * Application logs getters
     */
    public get logLevel(): string {
        return this.getString('APP_LOG_LEVEL');
    }

    public get logFolder(): string {
        return this.getPath('APP_LOG_FOLDER');
    }

    public get logFileMaxSize(): string {
        return this.getString('APP_LOG_FILE_MAX_SIZE');
    }

    public get logMaxFiles(): string {
        return this.getString('APP_LOG_MAX_FILES');
    }

    /**
     * Application directories getters
     */
    public get entities(): string[] {
        return this.getArrayValue('APP_DIRS_ENTITIES', this.parsePath);
    }

    public get migrations(): string[] {
        return this.getArrayValue('APP_DIRS_ENTITIES', this.parsePath);
    }

    public get subscribers(): string[] {
        return this.getArrayValue('APP_DIRS_ENTITIES', this.parsePath);
    }
}
