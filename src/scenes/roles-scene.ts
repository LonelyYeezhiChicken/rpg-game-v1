import { Warrior } from "../occupations/warrior";
import { Tank } from "../occupations/tank";
import { Mage } from "../occupations/mage";
import { SetWarrior } from "../occupations/setOccupations/setWarrior";
import { SetTank } from "../occupations/setOccupations/setTank";
import { SetMage } from "../occupations/setOccupations/setMage";
import { occupation } from "../occupations/interfaces/occupation";
import { OpKind } from "../models/enums/opKind";
import { RoleInfo } from "../component/roleInfo";

export class RolesScene extends Phaser.Scene {
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
    private infoArr: Array<Phaser.GameObjects.Text>;
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
        let textS: any = {
            font: "20px Arial",
            fill: "#FAFFFE",
            align: "left",
            backgroundColor: "#344648"
        };

        this.infoArr = [
            this.add.text(this.lineStartX + 10, this.lineStartY - 100, 'LV: 1 ', textS),
            this.add.text(this.lineStartX + 100, this.lineStartY - 100, 'HP: 1 ', textS),

            this.add.text(this.lineStartX + 10, this.lineStartY - 65, 'MP: 1 ', textS),
            this.add.text(this.lineStartX + 100, this.lineStartY - 65, 'STR: 1 ', textS),

            this.add.text(this.lineStartX + 10, this.lineStartY - 30, 'Inte: 1 ', textS),
            this.add.text(this.lineStartX + 100, this.lineStartY - 30, 'ACC: 1 ', textS),

            this.add.text(this.lineStartX + 10, this.lineStartY + 5, 'LUK: 1 ', textS),
            this.add.text(this.lineStartX + 100, this.lineStartY + 5, 'AGI: 1 ', textS),

            this.add.text(this.lineStartX + 10, this.lineStartY + 40, 'ATK: 1 ', textS),
            this.add.text(this.lineStartX + 100, this.lineStartY + 40, 'MATK: 1 ', textS)
        ];

        // 先隱藏
        this.infoArr.forEach(v => {
            v.visible = false;
        });
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
        this.infoArr.forEach(v => {
            v.visible = true;
        });
    }
    /**關閉選角視窗
     * 
     * @param name 角色
     */
    private closeRoleInfo(): void {
        this.disableRole(this.roleInfo);
        this.disableRole(this.close);
        this.disableRole(this.line);
        this.infoArr.forEach(v => {
            v.visible = false;
        });

        switch (this.nowRole) {
            case OpKind.warrior:
                this.disableRole(this.warrior);
                break;
            case OpKind.tank:
                this.disableRole(this.tank);
                break;
            case OpKind.mage:
                this.disableRole(this.mage);
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