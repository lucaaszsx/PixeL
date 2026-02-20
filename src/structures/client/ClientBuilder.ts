import { BASE_CLIENT_OPTIONS } from "@/config/constants";
import { Client, Collection } from "discord.js";

export class PixeL extends Client {
    private commands: ;
    private aliases: Collection<string, string[]>;

    constructor() {
        super(BASE_CLIENT_OPTIONS);

        this.commands = new Collection();
        this.aliases = new Collection();
    }
}