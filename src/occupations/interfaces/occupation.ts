import { AbilityDto } from "models/dtos/abilityDto";

export abstract class occupation {
    /**
     * 職業名稱
     */
    public abstract readonly occupationName: string;
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
    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    public skills(params: any, role: any): string {
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
        params.anims.create({
            key: this.modelName + 'Dead',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.dead),
            frameRate: 10,
            repeat: -1,
        });
        role.anims.play(this.modelName + 'Dead', true);
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
}