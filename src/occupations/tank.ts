import { occupation } from "interfaces/occupation";

export class Tank implements occupation {

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
            key: "tankSkill",
            frames: params.anims.generateFrameNumbers("tank", { start: 8, end: 14 }),
            frameRate: 10,
            repeat: -1,
        });
        params.tank.anims.play('tankSkill', true);

        return '賞你巴掌!';
    }

    /**
     * 死翹翹
     * @param params 場景
     */
    public dead(params: any): void {

        params.anims.create({
            key: "tankDead",
            frames: params.anims.generateFrameNumbers("tank", { start: 20, end: 24 }),
            frameRate: 10,
            repeat: -1,
        });
        params.tank.anims.play('tankDead', true);
    }

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    walk(params: any, direction: string): void {

        params.anims.create({
            key: "tankWalk",
            frames: params.anims.generateFrameNumbers("tank", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });
        if (direction === 'left') {
            params.tank.flipX = true;
            params.tank.x -= 2
        } else if (direction === 'up') {
            params.tank.y -= 2
        } else if (direction === 'down') {
            params.tank.y += 2
        } else {
            params.tank.flipX = false;
            params.tank.x += 2
        }

        params.tank.anims.play('tankWalk', true);
    }
}

