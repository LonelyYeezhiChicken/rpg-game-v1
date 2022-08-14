import { occupation } from "interfaces/occupation";

export class Mage implements occupation {

    /**
     * 職業名稱
     */
    public readonly occupationName: string = '坦克';
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
            key: "mageSkill",
            frames: params.anims.generateFrameNumbers("mage", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });
        params.mage.anims.play('mageSkill', true);

        return '丟你小石石!';
    }

    /**
     * 死翹翹
     * @param params 場景
     */
    public dead(params: any): void {

        params.anims.create({
            key: "mageDead",
            frames: params.anims.generateFrameNumbers("mage", { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1,
        });
        params.mage.anims.play('mageDead', true);
    }

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    walk(params: any, direction: string): void {

        params.anims.create({
            key: "mageWalk",
            frames: params.anims.generateFrameNumbers("mage", { start: 11, end: 16 }),
            frameRate: 10,
            repeat: -1,
        });
        if (direction === 'left') {
            params.mage.flipX = true;
            params.mage.x -= 2
        } else if (direction === 'up') {
            params.mage.y -= 2
        } else if (direction === 'down') {
            params.mage.y += 2
        } else {
            params.mage.flipX = false;
            params.mage.x += 2
        }

        params.mage.anims.play('mageWalk', true);
    }
}

