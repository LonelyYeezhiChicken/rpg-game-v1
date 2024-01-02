export interface HealthPointInterface {

    /**
     * 增加血量
     * 用於治療角色時增加其血量
     * 
     * @param amount 增加的血量值
     * @returns 新的血量值
     */
    heal(amount: number): number;

    /**
     * 減少血量
     * 藉由攻擊力來扣血
     * 
     * @param damage 受到的傷害值
     * @returns 新的血量值
     */
    takeDamage(damage: number): number;
}
