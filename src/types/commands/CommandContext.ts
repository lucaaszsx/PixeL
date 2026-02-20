import { I18nProviderInterface } from "@/lib/i18n";
import { ChatInputCommandInteraction, Message } from "discord.js";

export interface CommandContext {
    type: 'slash' | 'prefix';

    interaction?: ChatInputCommandInteraction;
    message?: Message;

    i18n: I18nProviderInterface;
}