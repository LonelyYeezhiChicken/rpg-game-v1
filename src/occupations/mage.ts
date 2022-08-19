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
        let newData: AbilityDto = JSON.parse(JSON.stringify(data));
        newData.intelligence = this.abilityRatio(newData.intelligence, 1.5);
        newData.magic = this.abilityRatio(newData.magic, 1.5);
        newData.health = this.abilityRatio(newData.health, 0.8);
        newData.mattack = this.abilityRatio(newData.mattack, 2);
        return newData;
    }
}

