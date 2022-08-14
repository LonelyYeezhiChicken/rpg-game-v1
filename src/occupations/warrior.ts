import { occupation } from "interfaces/occupation";

export class Warrior implements occupation {

    /**
     * 職業名稱
     */
    public readonly occupationName: string = '戰士';
    /**
    * 能力值
    */
    public ability() {
        throw new Error("Method not implemented.");
    }
    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    public skills(params: any): string {
        params.anims.create({
            key: "skill",
            frames: params.anims.generateFrameNumbers("warrior", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });
        params.warrior.anims.play('skill', true);

        return '吃我棒棒槌!';
    }

    /**
     * 死翹翹
     * @param params 場景
     */
    public dead(params: any): void {

        params.anims.create({
            key: "dead",
            frames: params.anims.generateFrameNumbers("warrior", { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1,
        });
        params.warrior.anims.play('dead', true);
    }

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    walk(params: any, direction: string): void {
        params.anims.create({
            key: "walk",
            frames: params.anims.generateFrameNumbers("warrior", { start: 11, end: 16 }),
            frameRate: 10,
            repeat: -1,
        });
        params.warrior.anims.play('walk', true);
    }
}

