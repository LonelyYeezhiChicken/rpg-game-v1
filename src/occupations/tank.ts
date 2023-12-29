import { occupation } from "./interfaces/occupation";
import { AbilityDto } from "models/dtos/abilityDto";

export class Tank extends occupation {

    /**
     * 職業名稱
     */
    public readonly occupationName: string = '坦克';
    /**
     * 技能名稱
     */
    public skillName: string = '賞你巴掌!';
    /**
     * 模組名稱
     */
    public modelName: string = 'tank';
    /**
     * 各式起始與結束
     */
    public readonly startAndEnd: any = {
        skills: { start: 8, end: 14 },
        dead: { start: 20, end: 24 },
        walk: { start: 0, end: 7 },
        stop: { start: 0, end: 0 },
    }
    /**
    * 能力值
    */
    public ability(data: AbilityDto): AbilityDto {
        let newData: AbilityDto = JSON.parse(JSON.stringify(data));
        newData.accuracy = this.abilityRatio(newData.accuracy, 0.8);
        newData.health = this.abilityRatio(newData.health, 2);
        newData.luck = this.abilityRatio(newData.luck, 2);
        newData.agility = this.abilityRatio(newData.agility, 1.5);
        return newData;
    }

}

