import { ClientEvents, Awaitable } from 'discord.js';

interface EventOptions<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: ClientEvents[K]) => Awaitable<void>
}

export class EventBuilder<K extends keyof ClientEvents> {
    public readonly name: K;
    public readonly once: boolean;
    public readonly execute: (...args: ClientEvents[K]) => Awaitable<void>;

    constructor({ name, once = false, execute }: EventOptions<K>) {
        this.name = name;
        this.once = once;
        this.execute = execute;
    }
}