/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { ApplicationEnvironment, PostgresEnvironment, DiscordEnvironment } from '@/lib/env';

export const Env = {
    App: new ApplicationEnvironment(),
    Pg: new PostgresEnvironment(),
    Discord: new DiscordEnvironment()
} as const;
