export class LevelBar extends Phaser.GameObjects.Graphics {
    private barWidth: number;
    private levelText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 76) {
        super(scene, { x, y });
        this.barWidth = width;
        scene.add.existing(this);

        this.levelText = scene.add.text(x + width + 5, y, '', {
            fontSize: '12px',
            color: '#ffffff'
        });
    }

    public draw(currentXp: number, xpForNextLevel: number, currentLevel: number): void {
        this.clear();

        const xpPercentage = currentXp / xpForNextLevel;
        const barInnerWidth = this.barWidth - 4; // 2px padding on each side

        // Draw background
        this.fillStyle(0x000000);
        this.fillRect(0, 0, this.barWidth, 16);

        // Draw XP meter (yellow color)
        this.fillStyle(0xffff00);
        this.fillRect(2, 2, barInnerWidth * xpPercentage, 12);

        this.levelText.setText(`Lv: ${currentLevel}`);
    }
}
