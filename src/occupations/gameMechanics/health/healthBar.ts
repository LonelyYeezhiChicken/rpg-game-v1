export class HealthBar extends Phaser.GameObjects.Graphics {
    private barWidth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 76) {
        super(scene, { x, y });
        this.barWidth = width;
        scene.add.existing(this);
    }

    public draw(currentHealth: number, maxHealth: number): void {
        this.clear();

        const healthPercentage = currentHealth / maxHealth;
        const healthBarColor = healthPercentage < 0.3 ? 0xff0000 : 0x00ff00;
        const barInnerWidth = this.barWidth - 4; // 2px padding on each side

        // Draw background
        this.fillStyle(0x000000);
        this.fillRect(0, 0, this.barWidth, 16);

        // Draw health meter
        this.fillStyle(healthBarColor);
        this.fillRect(2, 2, barInnerWidth * healthPercentage, 12);
    }
}
