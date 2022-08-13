
export class SetWarrior extends Phaser.GameObjects.Sprite {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(135, 121);

        this.scene.add.existing(this);
    }

}