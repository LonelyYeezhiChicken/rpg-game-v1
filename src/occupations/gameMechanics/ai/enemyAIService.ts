import { enemyAIEvents } from './enemy.ai.events';

interface EnemyAIConfig {
    attackRange: number;
    attackCooldown: number;
    enemyId: string;
}

export class EnemyAIService {
    private config: EnemyAIConfig;
    private lastAttackTime: number; // Simulate game time

    constructor(config: EnemyAIConfig) {
        this.config = config;
        this.lastAttackTime = -config.attackCooldown; // Allow immediate first attack
    }

    public update(currentTime: number, playerPosition: { x: number, y: number }, enemyPosition: { x: number, y: number }): void {
        console.log("EnemyAIService update called at time:", currentTime);
        const distance = Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, enemyPosition.x, enemyPosition.y);
        console.log("Distance:", distance);

        const canAttack = (currentTime - this.lastAttackTime) >= this.config.attackCooldown;
        console.log("canAttack:", canAttack, "currentTime:", currentTime, "lastAttackTime:", this.lastAttackTime, "cooldown:", this.config.attackCooldown);

        const inRange = distance <= this.config.attackRange;
        console.log("inRange:", inRange, "distance:", distance, "attackRange:", this.config.attackRange);

        if (inRange && canAttack) {
            console.log("Emitting enemy-attack event!");
            enemyAIEvents.emit('enemy-attack', this.config.enemyId, playerPosition);
            this.lastAttackTime = currentTime;
        } else {
            console.log("Not attacking. inRange:", inRange, "canAttack:", canAttack);
        }
    }
}
