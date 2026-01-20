import { AbilityDto, OpKind } from "../../models/index";
import { OccupationRepo, OccupationRepository } from '../../repository/index';
import { LocalStorageDao } from '../../dao/index'

export abstract class occupation {
    private readonly occupationRepo: OccupationRepo;

    constructor() {
        this.occupationRepo = new OccupationRepository(new LocalStorageDao());
    }

    /**
     * 目前角色直狀態
     */
    private isStop: boolean;
    /**
     * 職業名稱
     */
    public abstract readonly occupationName: string;
    /**
     * 技能名稱
     */
    public abstract readonly skillName: string;
    /**
     * 模組名稱
     */
    public abstract readonly modelName: string;
    /**
     * 各式起始與結束
     */
    public abstract readonly startAndEnd: any;
    /**
     * 職業
     */
    public abstract readonly kind: OpKind;

    /**
     * 能力值倍率計算
     * @param input 基礎能力
     * @param ratio 倍率
     */
    protected abilityRatio(input: number, ratio: number): number {
        return Math.floor(input * ratio);
    }

    /**
     * 能力值
     */
    public abstract ability(data: AbilityDto): AbilityDto;

    /**取得能力值 */
    public getAbility(): AbilityDto {
        return this.occupationRepo.Load(this.kind);
    }

    /**
     * 技能
     * @param params 場景
     * @returns 技能名稱
     */
    public skills(params: any, role: any): string {

        // 停止狀態在建立動畫
        if (this.isStop) {
            this.isStop = false;
            params.anims.create({
                key: this.modelName + 'Skill',
                frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.skills),
                frameRate: 10,
                repeat: -1,
            });
            role.anims.play(this.modelName + 'Skill', true);
        }
        return this.skillName;
    }
    /**
     * 死翹翹
     * @param params 場景
    */
    public dead(params: any, role: any): void {

        // 停止狀態在建立動畫
        if (this.isStop) {
            this.isStop = false;

            params.anims.create({
                key: this.modelName + 'Dead',
                frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.dead),
                frameRate: 10,
                repeat: -1,
            });
            role.anims.play(this.modelName + 'Dead', true);
        }
    }

    /**
     * 走路
     * @param params 場景
     * @param direction 方向
     */
    public walk(params: any, role: any, direction: string): void {
        if (direction === 'left') {
            role.flipX = true;
            role.x -= 2
        } else if (direction === 'up') {
            role.y -= 2
        } else if (direction === 'down') {
            role.y += 2
        } else {
            role.flipX = false;
            role.x += 2
        }


        // 停止狀態在建立動畫
        if (this.isStop) {
            this.isStop = false;

            params.anims.create({
                key: this.modelName + 'Walk',
                frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.walk),
                frameRate: 10,
                repeat: -1,
            });
            role.anims.play(this.modelName + 'Walk', true);
        }


    }

    /**
     * 停止動作
     * @param params 場景
     * @param role 角色
     * @param direction 方向 
     */
    public stop(params: any, role: any, direction: string): void {
        params.anims.create({
            key: this.modelName + 'Stop',
            frames: params.anims.generateFrameNumbers(this.modelName, this.startAndEnd.stop),
            frameRate: 10,
            repeat: -1,
        });

        role.anims.stop();
        if (direction === 'left') {
            role.flipX = true;
        } else if (direction === 'right') {
            role.flipX = false;
        }

        role.anims.play(this.modelName + 'Stop', true);

        role.anims.stop();

        this.isStop = true;
    }
}