import { Warrior } from "../occupations/warrior";
import { Tank } from "../occupations/tank";
import { Mage } from "../occupations/mage";
import { SetWarrior } from "../occupations/setOccupations/setWarrior";
import { SetTank } from "../occupations/setOccupations/setTank";
import { SetMage } from "../occupations/setOccupations/setMage";
import { occupation } from "../occupations/interfaces/occupation";
import { OpKind } from "../models/enums/opKind";
import { RoleInfo } from "../component/roleInfo";
import { AbilityDto } from "../models/dtos/abilityDto";
import { LocalStorageDao } from "../dao/localStorageDao";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";

export class RolesScene extends Phaser.Scene {
    private readonly opRepo: OccupationRepo;
    private tankBtn: Phaser.GameObjects.Sprite;
    private warriorBtn: Phaser.GameObjects.Sprite;
    private mageBtn: Phaser.GameObjects.Sprite;
    private warrior: Phaser.GameObjects.Sprite;
    private tank: Phaser.GameObjects.Sprite;
    private mage: Phaser.GameObjects.Sprite;
    private arrow: Phaser.GameObjects.Sprite;
    private roleInfo: Phaser.GameObjects.Sprite;
    private close: Phaser.GameObjects.Sprite;
    private line: Phaser.GameObjects.Sprite;
    private infoWarArr: Array<Phaser.GameObjects.Text>;
    private infoTankArr: Array<Phaser.GameObjects.Text>;
    private infoMageArr: Array<Phaser.GameObjects.Text>;
    private wrr: occupation;
    private tan: occupation;
    private mag: occupation;
    private nowRole: OpKind;
    private pointStart: number;
    private lineStartX: number;
    private lineStartY: number;
    private isOpenInfo: boolean = false;


    constructor() {
        super({
            key: "RolesScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao());
    }
    /** 文字 style
     * 
     * @returns 
     */
    private textStyle(): any {
        return {
            font: "32px Arial",
            fill: "#FAFFFE",
            align: "left",
            backgroundColor: "#344648"
        }
    }
    /**隱形角色 */
    private disableRole(role: Phaser.GameObjects.Sprite): void {
        role.alpha = 0;//透明度設為 0 
        this.physics.world.disable(role)//刪除物理性質
    }
    /**顯示角色 */
    private enableRole(role: Phaser.GameObjects.Sprite): void {
        role.alpha = 100;//透明度設為 100 
        this.physics.world.enable(role)//恢復物理性質        
    }
    /**生成角色資訊
     * 
     * @param thisArr 角色陣列
     * @param data 資料
     */
    private createInfo(data: AbilityDto): Array<Phaser.GameObjects.Text> {
        let textS: any = {
            font: "20px Arial",
            fill: "#FAFFFE",
            align: "left",
            backgroundColor: "#344648"
        };
        return [
            this.add.text(this.lineStartX + 10, this.lineStartY - 100, `LV: ${data.level} `, textS),
            this.add.text(this.lineStartX + 90, this.lineStartY - 100, `HP: ${data.health} `, textS),

            this.add.text(this.lineStartX + 10, this.lineStartY - 65, `MP: ${data.magic} `, textS),
            this.add.text(this.lineStartX + 100, this.lineStartY - 65, `STR: ${data.strength} `, textS),

            this.add.text(this.lineStartX + 10, this.lineStartY - 30, `Inte: ${data.intelligence} `, textS),
            this.add.text(this.lineStartX + 100, this.lineStartY - 30, `ACC: ${data.accuracy} `, textS),

            this.add.text(this.lineStartX + 10, this.lineStartY + 5, `LUK: ${data.luck} `, textS),
            this.add.text(this.lineStartX + 100, this.lineStartY + 5, `AGI: ${data.agility} `, textS),

            this.add.text(this.lineStartX + 10, this.lineStartY + 40, `ATK: ${data.attack} `, textS),
            this.add.text(this.lineStartX + 100, this.lineStartY + 40, `MATK: ${data.mattack} `, textS)
        ];
    }
    /** 建立角色
     * 
     */
    private createAllRole(): void {
        // 新增角色
        this.warrior = new SetWarrior({
            scene: this,
            x: this.pointStart - 100,
            y: 150,
            frame: 0,
            key: "warrior"
        });

        this.tank = new SetTank({
            scene: this,
            x: this.pointStart - 100,
            y: 120,
            frame: 0,
            key: "tank"
        });

        this.mage = new SetMage({
            scene: this,
            x: this.pointStart - 110,
            y: 170,
            frame: 0,
            key: "mage"
        });

        this.disableRole(this.warrior);
        this.disableRole(this.tank);
        this.disableRole(this.mage);
    }
    /** 建立選角視窗
     * 
     * @param width 場景中間點(寬)
     * @param height 場景中間點(高)
     */
    private createProfilePicture(width: number, height: number): void {
        let roleStrWidth = width - 200;

        this.wrr = new Warrior();
        this.tan = new Tank();
        this.mag = new Mage();
        this.warriorBtn = this.add.sprite(roleStrWidth, height, "warriorLogo").setInteractive();
        this.tankBtn = this.add.sprite(roleStrWidth + 200, height, "tankLogo").setInteractive();
        this.mageBtn = this.add.sprite(roleStrWidth + 400, height, "mageLogo").setInteractive();
        this.add.text(roleStrWidth, height + 40, this.wrr.occupationName, this.textStyle());
        this.add.text(roleStrWidth + 200, height + 40, this.tan.occupationName, this.textStyle());
        this.add.text(roleStrWidth + 400, height + 40, this.mag.occupationName, this.textStyle());
    }
    /**點擊角色
     * 
     * @param name 
     */
    private clickProfilePicture(name: OpKind): void {
        if (this.isOpenInfo === true)
            return;

        this.isOpenInfo = true;
        this.openRoleInfo(name);
        switch (name) {
            case OpKind.warrior:
                this.enableRole(this.warrior);
                this.disableRole(this.tank);
                this.disableRole(this.mage);
                this.arrow.setPosition(this.warriorBtn.x, this.warriorBtn.y - 100);
                break;
            case OpKind.tank:
                this.disableRole(this.warrior);
                this.enableRole(this.tank);
                this.disableRole(this.mage);
                this.arrow.setPosition(this.tankBtn.x, this.tankBtn.y - 100);
                break;
            case OpKind.mage:
                this.disableRole(this.warrior);
                this.disableRole(this.tank);
                this.enableRole(this.mage);
                this.arrow.setPosition(this.mageBtn.x, this.mageBtn.y - 100);
                break;
        }
    }
    /**角色資訊 */
    private createRoleInfo(): void {
        let data: AbilityDto = this.opRepo.Load(OpKind.newRole);
        // 產生能力值
        let wrInfo: AbilityDto = this.wrr.ability(data);
        let tkInfo: AbilityDto = this.tan.ability(data);
        let mgInfo: AbilityDto = this.mag.ability(data);
        // 存入
        this.opRepo.updateRole(OpKind.warrior, wrInfo);
        this.opRepo.updateRole(OpKind.tank, tkInfo);
        this.opRepo.updateRole(OpKind.mage, mgInfo);

        this.infoWarArr = this.createInfo(wrInfo);
        this.infoTankArr = this.createInfo(tkInfo);
        this.infoMageArr = this.createInfo(mgInfo);

        this.infoWarArr.forEach(v => { v.visible = false });
        this.infoTankArr.forEach(v => { v.visible = false });
        this.infoMageArr.forEach(v => { v.visible = false });
    }
    /**開啟選角視窗
     * 
     * @param name 角色
     */
    private openRoleInfo(name: OpKind): void {
        this.nowRole = name;
        this.enableRole(this.roleInfo);
        this.enableRole(this.close);
        this.enableRole(this.line);

        switch (this.nowRole) {
            case OpKind.warrior:
                this.disableRole(this.warrior);
                this.infoWarArr.forEach(v => {
                    v.visible = true;
                });
                break;
            case OpKind.tank:
                this.disableRole(this.tank);
                this.infoTankArr.forEach(v => {
                    v.visible = true;
                });
                break;
            case OpKind.mage:
                this.disableRole(this.mage);
                this.infoMageArr.forEach(v => {
                    v.visible = true;
                });
                break;
        }
    }
    /**關閉選角視窗
     * 
     * @param name 角色
     */
    private closeRoleInfo(): void {
        this.disableRole(this.roleInfo);
        this.disableRole(this.close);
        this.disableRole(this.line);

        switch (this.nowRole) {
            case OpKind.warrior:
                this.disableRole(this.warrior);
                this.infoWarArr.forEach(v => {
                    v.visible = false;
                });
                break;
            case OpKind.tank:
                this.disableRole(this.tank);
                this.infoTankArr.forEach(v => {
                    v.visible = false;
                });
                break;
            case OpKind.mage:
                this.disableRole(this.mage);
                this.infoMageArr.forEach(v => {
                    v.visible = false;
                });
                break;
        }
    }
    /**
     * 載入素材
     */
    preload(): void {
        this.load.pack(
            "GameRoles",
            "./src/assets/pack.json",
            "GameRoles"
        );
    }

    /**
   * 生成物件
   */
    create(): void {
        // 1. 背景
        // 取得寬高
        let width: number = <number>this.sys.game.config.width / 2;
        let height = <number>this.sys.game.config.height / 2;
        let bg: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, "background2");
        // 設定位置
        bg.setPosition(width, height);

        // 2. 選角視窗
        this.createProfilePicture(width, height);


        // 3. 事件註冊
        this.warriorBtn.on("pointerdown", () => {
            this.clickProfilePicture(OpKind.warrior);
        });
        this.tankBtn.on("pointerdown", () => {
            this.clickProfilePicture(OpKind.tank);
        });
        this.mageBtn.on("pointerdown", () => {
            this.clickProfilePicture(OpKind.mage);
        });


        // 4. 箭頭
        this.arrow = this.add
            .sprite(-10, -10, "arrow")
            .setScale(0.2, 0.2)
            .setAngle(90);

        // 5. 角色資訊
        this.roleInfo = new RoleInfo({
            scene: this,
            x: width,
            y: 150,
            frame: 0,
            key: "info"
        }).setScale(1.5, 1.5);

        this.close = this.add.sprite(465, 45, "close", 0)
            .setScale(0.5, 0.5)
            .setInteractive();
        this.physics.world.enable(this.close);
        this.close.body.allowGravity = false;
        this.close.on("pointerdown", () => {
            this.isOpenInfo = false;
            this.closeRoleInfo();
        });

        this.pointStart = this.roleInfo.x;
        this.disableRole(this.roleInfo);
        this.disableRole(this.close);

        this.line = this.add
            .sprite(width - 30, 150, "line")
            .setScale(1, 0.8);

        this.physics.world.enable(this.line);
        this.line.body.allowGravity = false;
        this.lineStartX = this.line.x;
        this.lineStartY = this.line.y;
        this.disableRole(this.line);

        // 6. 建立角色
        this.createAllRole();

        // 7. 建立角色資訊
        this.createRoleInfo();
    }
}