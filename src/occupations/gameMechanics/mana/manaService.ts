import { manaEvents } from './mana.events';

export class ManaService {
    private currentMana: number;
    private maxMana: number;

    constructor(maxMana: number) {
        this.maxMana = maxMana;
        this.currentMana = maxMana;
    }

    public useMana(amount: number): boolean {
        if (this.currentMana >= amount) {
            this.currentMana -= amount;
            manaEvents.emit('mana-changed', this.currentMana, this.maxMana);
            return true;
        }
        return false;
    }

    public restoreMana(amount: number): void {
        this.currentMana += amount;
        if (this.currentMana > this.maxMana) {
            this.currentMana = this.maxMana;
        }
        manaEvents.emit('mana-changed', this.currentMana, this.maxMana);
    }

    public getMana(): number {
        return this.currentMana;
    }

    public getMaxMana(): number {
        return this.maxMana;
    }
}
