import { HealthPointDto } from "../../../models/index";
import { HealthPointInterface } from "./healthPoint.interface";
import { HealthPointRepository } from './healthPoint.repository';

export class HealthPointService implements HealthPointInterface {

    private health: HealthPointDto;
    private healthPointRepo: HealthPointRepository;

    constructor(hp: number) {
        this.setData(hp);
    }

    /**建立血量資訊
     * 
     * @param hp 最大血量
     */
    private setData(hp: number): void {
        this.health = {
            maxHealth: hp,
            currentHealth: hp,
            healthPercentage: 100
        };

        this.healthPointRepo = new HealthPointRepository();
        this.healthPointRepo.create(this.health);
    }

    /**
     * 增加血量
     * 用於治療角色時增加其血量
     * 
     * @param amount 增加的血量值
     * @returns 新的血量值
     */
    heal(amount: number): HealthPointDto {

        // 查詢目前血量
        let currentHealth = this.health.currentHealth;

        // 增加目前血量
        currentHealth = Math.min(currentHealth + amount, this.health.maxHealth);

        // 更新血量百分比
        const healthPercentage = (currentHealth / this.health.maxHealth) * 100;

        // 更新資料
        this.health.currentHealth = currentHealth;
        this.health.healthPercentage = healthPercentage;

        this.healthPointRepo.update(this.health);

        // 回傳
        return this.health;
    }

    /**
     * 減少血量
     * 藉由攻擊力來扣血
     * 
     * @param damage 受到的傷害值
     * @returns 新的血量值
     */
    takeDamage(damage: number): HealthPointDto {
        // 查詢目前血量
        let currentHealth = this.health.currentHealth;

        // 減少目前血量
        currentHealth = Math.min(currentHealth - damage, 0);

        // 更新血量百分比
        const healthPercentage = (currentHealth / this.health.maxHealth) * 100;

        // 更新資料
        this.health.currentHealth = currentHealth;
        this.health.healthPercentage = healthPercentage;

        this.healthPointRepo.update(this.health);

        // 回傳
        return this.health;
    }
}