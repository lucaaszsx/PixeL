/**
 * @file constants.ts
 * @description General purporse constants.
 * @author Lucas
 * @license MIT
 */

import { ClientOptions, GatewayIntentBits, Options } from 'discord.js';

/**
 * A constant to represent source and distribution paths
 * based on tsconfig.json
 */
export const PROJECT_PATHS = {
    source: 'src',
    distribution: 'dist'
} as const;

/**
 * Base options for Discord client
 */
export const BASE_CLIENT_OPTIONS: ClientOptions = {
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds
    ],

    makeCache: Options.cacheEverything(),

    sweepers: {
        messages: {
            interval: 3600,
            lifetime: 1800
        }
    },

    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },

    failIfNotExists: false
} as const;
