import { AbilityDto } from "../../models/index";

export abstract class Masters {
    /**
    * 職業名稱
    */
    public abstract readonly name: string;
    /**
     * 技能名稱
     */
    public abstract readonly skillName: string;
    /**
     * 模組名稱
     */
    public abstract readonly modelName: string;
    /**
     * 各式起始與結束
     */
    public abstract readonly startAndEnd: any;

    /**
     * 能力值倍率計算
     * @param input 基礎能力
     * @param ratio 倍率
     */
    protected abilityRatio(input: number, ratio: number): number {
        return Math.floor(input * ratio);
    }

    /**
     * 能力值
     */
    public abstract ability(data: AbilityDto): any;

    public abstract aiUpdate(currentTime: number, playerPosition: { x: number, y: number }, enemyPosition: { x: number, y: number }): void;

    public abstract shutdown(): void;
    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    public skills(params: any, role: any): string {
        role.flipX = true;
        params.anims.create({
            key: this.modelName + 'Skill',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.skills),
            frameRate: 10,
            repeat: -1,
        });
        role.anims.play(this.modelName + 'Skill', true);

        return this.skillName;
    }
    /**
     * 死翹翹
     * @param params 場景
    */
    public dead(params: any, role: any): void {
        role.flipX = true;
        params.anims.create({
            key: this.modelName + 'Dead',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.dead),
            frameRate: 10,
            repeat: -1,
        });
        role.anims.play(this.modelName + 'Dead');
    }

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    walk(params: any, role: any, direction: string): void {
        params.anims.create({
            key: this.modelName + 'Walk',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.walk),
            frameRate: 10,
            repeat: -1,
        });
        if (direction === 'left') {
            role.flipX = true;
            role.x -= 2
        } else if (direction === 'up') {
            role.y -= 2
        } else if (direction === 'down') {
            role.y += 2
        } else {
            role.flipX = false;
            role.x += 2
        }

        role.anims.play(this.modelName + 'Walk', true);
    }

    /**
     * 停止
     * @param params 場景
     * @param role 角色
     * @param direction 方向 
     */
    public stop(params: any, role: any, direction: string): void {
        params.anims.create({
            key: this.modelName + 'Stop',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.stop),
            frameRate: 10,
            repeat: -1,
        });

        role.anims.stop();
        if (direction === 'left') {
            role.flipX = true;
        } else if (direction === 'right') {
            role.flipX = false;
        }

        role.anims.play(this.modelName + 'Stop', true);

        role.anims.stop();
    }
}