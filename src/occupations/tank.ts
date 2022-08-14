import { occupation } from "./interfaces/occupation";

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
        walk: { start: 0, end: 7 }
    }
    /**
    * 能力值
    */
    public ability() {
        throw new Error("Method not implemented.");
    }

}

