export class ManaBar extends Phaser.GameObjects.Graphics {
    private barWidth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 76) {
        super(scene, { x, y });
        this.barWidth = width;
        scene.add.existing(this);
    }

    public draw(currentMana: number, maxMana: number): void {
        this.clear();

        const manaPercentage = currentMana / maxMana;
        const barInnerWidth = this.barWidth - 4; // 2px padding on each side

        // Draw background
        this.fillStyle(0x000000);
        this.fillRect(0, 0, this.barWidth, 16);

        // Draw mana meter (blue color)
        this.fillStyle(0x0000ff);
        this.fillRect(2, 2, barInnerWidth * manaPercentage, 12);
    }
}
