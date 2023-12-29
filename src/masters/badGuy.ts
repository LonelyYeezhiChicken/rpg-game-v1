import { Masters } from "./interfaces/master";
import { AbilityDto } from "../models/dtos/abilityDto";


export class BadGuy extends Masters {

    /**
        * 職業名稱
        */
    public readonly name: string = '雜魚';
    /**
     * 技能名稱
     */
    public skillName: string = '來打棒球!';
    /**
     * 模組名稱
     */
    public modelName: string = 'badGuy';
    /**
     * 各式起始與結束
     */
    public readonly startAndEnd: any = {
        skills: { start: 7, end: 13 },
        dead: { start: 14, end: 16 },
        walk: { start: 0, end: 5 },
        stop: { start: 6, end: 6 },
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