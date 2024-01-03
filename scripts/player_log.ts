import { Player, world } from '@minecraft/server';

export class PlayerLog<T extends any = any> {
    data: Map<string, T>;
    events: Object;

    constructor() {
        this.data = new Map();
        world.afterEvents.playerLeave.subscribe((eventData) => {
            this.data.delete(eventData.playerId);
        });
    }

    set(player: Player, data: T): void {
        this.data.set(player.id, data);
    }

    get(player: Player): T | undefined {
        return this.data.get(player.id);
    }

    has(player: Player): boolean {
        return this.data.has(player.id);
    }

    delete(player: Player): void {
        this.data.delete(player.id);
    }

    clear(): void {
        this.data.clear();
    }

    playerIDs(): string[] {
        return [...this.data.keys()];
    }

    includes(player: Player): boolean {
        return this.playerIDs().includes(player.id);
    }
}
