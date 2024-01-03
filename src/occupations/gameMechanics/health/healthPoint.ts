export class HealthPoint extends Phaser.GameObjects.Sprite {
    constructor(params: { scene: any; x: any; y: any; frame: any; key: any; }) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.scene.physics.world.enable(this);
        // this.body.allowGravity = false;
        // this.body.setSize(135, 121);

        this.scene.add.existing(this);
    }
}