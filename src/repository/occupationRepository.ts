
import { AbilityDto } from "../models/dtos/abilityDto";
import { OpKind } from "../models/enums/opKind";
import { Dao } from "../dao/interfaces/dao"

export interface OccupationRepo {
    /**
     * 建立角色初始值
     * @param data 角色初始值
     */
    createRole(data: AbilityDto): void;
    /**
     * 更新角色初始值
     * @param roleName 角色
     * @param data 角色初始值
     */
    updateRole(roleName: OpKind, data: AbilityDto): void;
}

export class OccupationRepository implements OccupationRepo {
    private readonly firstKey: string;
    private readonly dao: Dao;

    constructor(dao: Dao) {
        this.firstKey = "OccupationRepository";
        this.dao = dao;
    }

    /**
    * 建立角色初始值
    * @param data 角色初始值
    */
    createRole(data: AbilityDto): void {
        if (this.dao.read<AbilityDto>(this.firstKey + "newRole") === null)
            this.dao.create<AbilityDto>(this.firstKey + "newRole", data);
    }
    /**
     * 更新角色初始值
     * @param data 角色初始值
     */
    updateRole(roleName: OpKind, data: AbilityDto): void {
        throw new Error("Method not implemented.");
    }

}