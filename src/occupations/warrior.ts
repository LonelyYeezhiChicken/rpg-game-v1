interface occupation {
    /**
     * 職業名稱
     */
    readonly occupationName: string;
    /**
     * 能力值
     */
    ability(): any;
    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    skills(params: any): string;
    /**
     * 死翹翹
     * @param params 場景
    */
    dead(params: any): void;
}


export class SetWarrior extends Phaser.GameObjects.Sprite {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        // this.setScale(3);
        // this.setOrigin(150, 150);

        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        //this.body.setVelocityX(-200);
        this.body.setSize(135, 121);

        this.scene.add.existing(this);
    }

}

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

}

