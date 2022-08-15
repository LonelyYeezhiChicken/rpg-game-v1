import { occupation } from "./interfaces/occupation";
import { AbilityDto } from "models/dtos/abilityDto";

export class Mage extends occupation {
    /**
     * 職業名稱
     */
    public readonly occupationName: string = '法師';
    /**
   * 技能名稱
   */
    public skillName: string = '丟你小石石!';
    /**
     * 模組名稱
     */
    public modelName: string = 'mage';
    /**
     * 各式起始與結束
     */
    public readonly startAndEnd: any = {
        skills: { start: 0, end: 4 },
        dead: { start: 5, end: 9 },
        walk: { start: 11, end: 16 }
    }

    /**
    * 能力值
    */
    public ability(data: AbilityDto): AbilityDto {
        data.intelligence = this.abilityRatio(data.intelligence, 1.5);
        data.magic = this.abilityRatio(data.magic, 1.5);
        data.health = this.abilityRatio(data.health, 0.8);
        data.mattack = this.abilityRatio(data.mattack, 2);
        return data;
    }
}

