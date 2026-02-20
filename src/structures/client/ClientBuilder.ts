import { BASE_CLIENT_OPTIONS } from '@/config/constants';
import { Collection, Client } from 'discord.js';
import { Command } from '@/types';

export class PixeL extends Client {
    private commands: Collection<string, Command>;
    private aliases: Collection<string, string[]>;

    constructor() {
        super(BASE_CLIENT_OPTIONS);

        this.commands = new Collection();
        this.aliases = new Collection();
    }
}
