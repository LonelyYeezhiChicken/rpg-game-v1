import { Warrior } from "../occupations/warrior";
import { Tank } from "../occupations/tank";
import { Mage } from "../occupations/mage";
import { SetWarrior } from "../occupations/setOccupations/setWarrior";
import { SetTank } from "../occupations/setOccupations/setTank";
import { SetMage } from "../occupations/setOccupations/setMage";
import { occupation } from "../occupations/interfaces/occupation";
import { OpKind } from "../models/enums/opKind";

export class RolesScene extends Phaser.Scene {
    private tankBtn: Phaser.GameObjects.Sprite;
    private warriorBtn: Phaser.GameObjects.Sprite;
    private mageBtn: Phaser.GameObjects.Sprite;
    private warrior: Phaser.GameObjects.Sprite;
    private tank: Phaser.GameObjects.Sprite;
    private mage: Phaser.GameObjects.Sprite;
    private keyboard: Phaser.Input.Keyboard.CursorKeys;
    private wrr: occupation;
    private tan: occupation;
    private mag: occupation;

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
            x: 55,
            y: 150,
            frame: 0,
            key: "warrior"
        });

        this.tank = new SetTank({
            scene: this,
            x: 60,
            y: 120,
            frame: 0,
            key: "tank"
        });

        this.mage = new SetMage({
            scene: this,
            x: 45,
            y: 170,
            frame: 0,
            key: "mage"
        });

        this.disableRole(this.warrior);
        this.disableRole(this.tank);
        this.disableRole(this.mage);

        this.wrr = new Warrior();
        this.tan = new Tank();
        this.mag = new Mage();
    }
    /** 建立選角視窗
     * 
     * @param width 場景中間點(寬)
     * @param height 場景中間點(高)
     */
    private createProfilePicture(width: number, height: number): void {
        let roleStrWidth = width - 30;

        this.warriorBtn = this.add.sprite(roleStrWidth, height, "warriorLogo").setInteractive();;
        this.tankBtn = this.add.sprite(roleStrWidth + 120, height, "tankLogo").setInteractive();;
        this.mageBtn = this.add.sprite(roleStrWidth + 240, height, "mageLogo").setInteractive();;
        this.add.text(roleStrWidth, height + 40, this.wrr.occupationName, this.textStyle());
        this.add.text(roleStrWidth + 120, height + 40, this.tan.occupationName, this.textStyle());
        this.add.text(roleStrWidth + 240, height + 40, this.mag.occupationName, this.textStyle());
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

        // 2. 建立角色
        this.createAllRole();

        // 3. 選角視窗
        this.createProfilePicture(width, height);
        console.log('hi');
        // 4. 事件註冊
        this.warriorBtn.on("pointerdown", () => {
            this.clickEvent(OpKind.warrior);
        });
        this.tankBtn.on("pointerdown", () => {
            this.clickEvent(OpKind.tank);
        });
        this.mageBtn.on("pointerdown", () => {
            this.clickEvent(OpKind.mage);
        });
    }

    private clickEvent(name: OpKind): void {
        switch (name) {
            case OpKind.warrior:
                this.enableRole(this.warrior);
                this.disableRole(this.tank);
                this.disableRole(this.mage);
                break;
            case OpKind.tank:
                this.disableRole(this.warrior);
                this.enableRole(this.tank);
                this.disableRole(this.mage);
                break;
            case OpKind.mage:
                this.disableRole(this.warrior);
                this.disableRole(this.tank);
                this.enableRole(this.mage);
                break;
        }
    }
}