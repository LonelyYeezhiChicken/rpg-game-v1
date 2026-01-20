import { Masters } from "./interfaces/master";
import { AbilityDto } from "../models/dtos/ability.dto";
import { EnemyAIService } from "../occupations/gameMechanics/ai/enemyAIService";
import { enemyAIEvents } from "../occupations/gameMechanics/ai/enemy.ai.events";
import { Direction } from "../models/enums/direction"; // Import Direction enum


export class BadGuy extends Masters {
    private enemyAIService: EnemyAIService;
    private unsubscribeAI: () => void;
    private badGuySprite: Phaser.GameObjects.Sprite; // Store the sprite instance

    constructor() {
        super();
        // Initialize AI service with specific parameters for this BadGuy
        // These values can be made configurable later
        this.enemyAIService = new EnemyAIService({
            attackRange: 100, // Example range
            attackCooldown: 1000, // 1 second cooldown
            movementSpeed: 50, // Example movement speed
            minAttackAnimationDuration: 1000, // Minimum 1 second for attack animation
            enemyId: this.modelName // Use modelName as a unique ID for this enemy type
        });

        this.unsubscribeAI = enemyAIEvents.on('enemy-attack', (enemyId: string, playerPosition: { x: number, y: number }) => {
            if (enemyId === this.modelName && this.badGuySprite) {
                // Trigger BadGuy's attack animation/logic
                console.log(`${this.name} (${enemyId}) attacks player at:`, playerPosition);
                // Here we would call the skills method on the actual sprite via PlayScene
                // PlayScene will listen to these events and call skills on the badGuySprite
            }
        });
    }

    public setSprite(sprite: Phaser.GameObjects.Sprite): void {
        this.badGuySprite = sprite;
    }

    shutdown() {
        if (this.unsubscribeAI) {
            this.unsubscribeAI();
        }
    }
    /**
        * 職業名稱
        */
    public readonly name: string = '雜魚';
    /**
     * 技能名稱
     */
    public skillName: string = '來打棒球!';
    /**
     * 模組名稱
     */
    public modelName: string = 'badGuy';
    /**
     * 各式起始與結束
     */
    public readonly startAndEnd: any = {
        skills: { start: 7, end: 13 },
        dead: { start: 14, end: 16 },
        walk: { start: 0, end: 5 },
        stop: { start: 6, end: 6 },
    }
    /**
    * 能力值
    */
    public ability(data: AbilityDto): AbilityDto {
        let newData: AbilityDto = JSON.parse(JSON.stringify(data));
        newData.accuracy = this.abilityRatio(newData.accuracy, 0.8);
        newData.health = this.abilityRatio(newData.health, 2);
        newData.luck = this.abilityRatio(newData.luck, 2);
        newData.agility = this.abilityRatio(newData.agility, 1.5);
        return newData;
    }

    public aiUpdate(currentTime: number, playerPosition: { x: number, y: number }, enemyPosition: { x: number, y: number }): void {
        this.enemyAIService.update(currentTime, playerPosition, enemyPosition);
    }

}