/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { BaseEnvironment } from './BaseEnvironment';

export class PostgresEnvironment extends BaseEnvironment {
    public get host(): string {
        return this.getString('POSTGRES_HOST');
    }

    public get port(): number {
        return this.getInt('POSTGRES_PORT');
    }

    public get username(): string {
        return this.getString('POSTGRES_USER');
    }

    public get password(): string {
        return this.getString('POSTGRES_PASSWORD');
    }

    public get dbName(): string {
        return this.getString('POSTGRES_DB');
    }

    public get sync(): boolean {
        return this.getBool('POSTGRES_SYNCHRONIZE');
    }

    public get logging(): boolean {
        return this.getBool('POSTGRES_LOGGING');
    }

    public getConnectionURL(): string {
        return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.dbName}`;
    }
}
