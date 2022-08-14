export interface occupation {
    /**
     * 職業名稱
     */
    readonly occupationName: string;
    /**
     * 能力值
     */
    ability(): any;
    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    skills(params: any): string;
    /**
     * 死翹翹
     * @param params 場景
    */
    dead(params: any): void;

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    walk(params: any, direction: string): void;
}