import { healthEvents } from './health.events';

export class HealthService {
    private currentHealth: number;
    private maxHealth: number;

    constructor(maxHealth: number) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    public takeDamage(amount: number): void {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        healthEvents.emit('health-changed', this.currentHealth, this.maxHealth);
    }

    public heal(amount: number): void {
        this.currentHealth += amount;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        healthEvents.emit('health-changed', this.currentHealth, this.maxHealth);
    }

    public getHealth(): number {
        return this.currentHealth;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }
}
