import { occupation } from "./interfaces/occupation";

export class Warrior extends occupation {


    /**
     * 職業名稱
     */
    public readonly occupationName: string = '戰士';
    /**
     * 技能名稱
     */
    public readonly skillName: string = '吃我棒棒槌!';
    /**
     * 模組名稱
     */
    public readonly modelName: string = 'warrior';
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
    public ability() {
        throw new Error("Method not implemented.");
    }
}

