/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { BaseEnvironment } from './BaseEnvironment';

export class DiscordEnvironment extends BaseEnvironment {
    public get clientToken(): string {
        return this.getString('DISCORD_CLIENT_TOKEN');
    }
}
