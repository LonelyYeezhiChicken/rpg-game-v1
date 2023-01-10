
import { AbilityDto } from "../models/dtos/abilityDto";
import { OpKind } from "../models/enums/opKind";
import { Dao } from "../dao/index"

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
    /**
     * 取得角色
     * @param role 角色
     */
    Load(role: OpKind): AbilityDto;
    /**
     * 設定使用者的選角
     * @param role 
     */
    setUserRole(role: OpKind): void;
    /**
     * 取得使用者的選角
     */
    getUserRole(): OpKind;
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
        if (this.dao.read<AbilityDto>(this.firstKey + OpKind.newRole.toString()) === null)
            this.dao.create<AbilityDto>(this.firstKey + OpKind.newRole.toString(), data);
    }
    /**
     * 更新角色初始值
     * @param data 角色初始值
     */
    updateRole(roleName: OpKind, data: AbilityDto): void {
        this.dao.create<AbilityDto>(this.firstKey + roleName.toString(), data);
    }
    /**
     * 取得角色
     * @param role 角色
     */
    Load(role: OpKind): AbilityDto {
        return this.dao.read<AbilityDto>(this.firstKey + OpKind.newRole.toString());
    }
    /**
    * 設定使用者的選角
    * @param role 
    */
    setUserRole(role: OpKind): void {
        this.dao.create<OpKind>(this.firstKey + "setUserRole", role);
    }
    /**
     * 取得使用者的選角
     */
    getUserRole(): OpKind {
        return this.dao.read<OpKind>(this.firstKey + "setUserRole");
    }
}