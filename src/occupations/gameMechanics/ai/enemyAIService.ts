import { enemyAIEvents } from './enemy.ai.events';
import { Direction } from '../../../models/enums/direction';

interface EnemyAIConfig {
    attackRange: number;
    attackCooldown: number;
    movementSpeed: number;
    minAttackAnimationDuration: number; // New property for minimum animation duration
    enemyId: string;
}

export class EnemyAIService {
    private config: EnemyAIConfig;
    private lastAttackTime: number;
    private currentDirection: Direction = Direction.right;
    private isAttackAnimationActive: boolean = false; // New state variable

    constructor(config: EnemyAIConfig) {
        this.config = config;
        this.lastAttackTime = -config.attackCooldown;
    }

    public update(currentTime: number, playerPosition: { x: number, y: number }, enemyPosition: { x: number, y: number }): void {
        const distance = Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, enemyPosition.x, enemyPosition.y);

        const canAttack = (currentTime - this.lastAttackTime) >= this.config.attackCooldown;
        const inRange = distance <= this.config.attackRange;

        if (!inRange) { // Priority 1: Player moved out of range, always move towards them
            if (this.isAttackAnimationActive) {
                enemyAIEvents.emit('enemy-command-stop', this.config.enemyId, this.currentDirection);
                this.isAttackAnimationActive = false;
            }

            let direction: Direction;
            if (playerPosition.x < enemyPosition.x) {
                direction = Direction.left;
            } else {
                direction = Direction.right;
            }
            this.currentDirection = direction;
            enemyAIEvents.emit('enemy-command-move', this.config.enemyId, direction);
        } else if (inRange && canAttack) { // Priority 2: In range and can attack
            enemyAIEvents.emit('enemy-attack', this.config.enemyId, playerPosition);
            this.lastAttackTime = currentTime;
            this.isAttackAnimationActive = true;
        } else if (this.isAttackAnimationActive && (currentTime - this.lastAttackTime) < this.config.minAttackAnimationDuration) {
            // Priority 3: In range, on cooldown, but attack animation is still playing (within min duration)
            // Do nothing, continue current state (attack animation)
        } else { // Priority 4: In range, on cooldown, and min animation duration passed
            if (this.isAttackAnimationActive) { // If it was attacking, stop it
                enemyAIEvents.emit('enemy-command-stop', this.config.enemyId, this.currentDirection);
                this.isAttackAnimationActive = false;
            } else { // Already stopped or not attacking, ensure it's in a stopped state
                enemyAIEvents.emit('enemy-command-stop', this.config.enemyId, this.currentDirection);
            }
        }
    }
}
