import { GuildBasedChannel, Collection, GuildMember, User, Role } from "discord.js";

/** All supported argument types */
export type CommandArgumentType = string | number | boolean | User | GuildMember | GuildBasedChannel | Role;

/** A single resolved argument */
export interface CommandResolvedArgument {
    name: string;
    value: CommandArgumentType;
}

/** Multiple resolved arguments */
export type CommandResolvedArguments = Collection<string, CommandResolvedArgument>;