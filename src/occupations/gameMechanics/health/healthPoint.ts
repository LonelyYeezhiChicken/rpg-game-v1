import { HealthPointService } from './healthPoint.service';
import { HealthPointDto } from "../../../models/index";

export class HealthPoint extends Phaser.GameObjects.Graphics {
    private value: number;
    private p: number;
    private readonly healthPointService: HealthPointService;

    constructor(scene: Phaser.Scene, x: number, y: number, hp: number, role: string) {
        super(scene, { x: x, y: y });

        this.healthPointService = new HealthPointService(hp, role);
        console.log('最大血量', hp);
        // Initialize the health bar value and percentage
        this.value = hp;
        this.p = 76 / hp; // Assuming the health bar's width is 76 pixels

        // Draw the health bar
        this.draw(100);

        // Add this graphics object to the scene
        scene.add.existing(this);
    }

    /**
    * 增加血量
    * 用於治療角色時增加其血量
    * 
    * @param amount 增加的血量值
    * @returns 新的血量值
    */
    heal(amount: number): void {
        const hpData: HealthPointDto = this.healthPointService.takeDamage(amount);

        this.value = hpData.currentHealth;

        this.draw(hpData.healthPercentage);
    }

    /**
     * 減少血量
     * 藉由攻擊力來扣血
     * 
     * @param damage 受到的傷害值
     */
    takeDamage(damage: number): void {
        const hpData: HealthPointDto = this.healthPointService.takeDamage(damage);

        this.value = hpData.currentHealth;
        console.log('攻擊力', damage);
        console.log('殘餘血量', hpData.currentHealth);

        this.draw(hpData.healthPercentage);
    }

    private draw(healthPercentage: number): void {
        // 清除之前的圖形
        this.clear();

        // 繪製背景
        this.fillStyle(0x000000);
        this.fillRect(0, 0, 80, 16); // 注意坐標是相對於圖形物件的

        // 繪製血量
        if (healthPercentage < 30) {
            this.fillStyle(0xff0000);
        } else {
            this.fillStyle(0x00ff00);
        }

        // 繪製血條
        this.fillRect(2, 2, this.p * this.value, 12); // 同樣，坐標是相對的
    }
}

