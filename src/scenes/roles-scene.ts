import { Warrior, Tank, Mage, SetWarrior, SetTank, SetMage, occupation } from "../occupations/index";
import { AbilityDto, OpKind } from "../models/index";
import { RoleInfo } from "../component/index";
import { LocalStorageDao } from "../dao/index";
import { SceneUtil } from "../utils/index";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";

export class RolesScene extends Phaser.Scene {
    private sceneUtil: SceneUtil;
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
    private nextBtn: Phaser.GameObjects.Sprite;
    private infoWarArr: Array<Phaser.GameObjects.Text>;
    private infoTankArr: Array<Phaser.GameObjects.Text>;
    private infoMageArr: Array<Phaser.GameObjects.Text>;
    private wrr: occupation;
    private tan: occupation;
    private mag: occupation;
    private nowRole: OpKind;
    private nextText: Phaser.GameObjects.Text;
    private pointStart: number;
    private lineStartX: number;
    private lineStartY: number;
    private isOpenInfo: boolean = false;


    constructor() {
        super({
            key: "RolesScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao());
        this.sceneUtil = new SceneUtil(this);
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

        this.sceneUtil.disableRole(this.warrior);
        this.sceneUtil.disableRole(this.tank);
        this.sceneUtil.disableRole(this.mage);
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
        this.add.text(roleStrWidth, height + 40, this.wrr.occupationName, SceneUtil.textStyle());
        this.add.text(roleStrWidth + 200, height + 40, this.tan.occupationName, SceneUtil.textStyle());
        this.add.text(roleStrWidth + 400, height + 40, this.mag.occupationName, SceneUtil.textStyle());
    }
    /**點擊角色
     * 
     * @param name 
     */
    private clickProfilePicture(name: OpKind): void {
        this.nextText.setText('');
        if (this.isOpenInfo === true)
            return;

        this.isOpenInfo = true;
        this.openRoleInfo(name);
        switch (name) {
            case OpKind.warrior:
                this.sceneUtil.enableRole(this.warrior);
                this.sceneUtil.disableRole(this.tank);
                this.sceneUtil.disableRole(this.mage);
                this.arrow.setPosition(this.warriorBtn.x, this.warriorBtn.y - 100);
                break;
            case OpKind.tank:
                this.sceneUtil.disableRole(this.warrior);
                this.sceneUtil.enableRole(this.tank);
                this.sceneUtil.disableRole(this.mage);
                this.arrow.setPosition(this.tankBtn.x, this.tankBtn.y - 100);
                break;
            case OpKind.mage:
                this.sceneUtil.disableRole(this.warrior);
                this.sceneUtil.disableRole(this.tank);
                this.sceneUtil.enableRole(this.mage);
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
        this.sceneUtil.enableRole(this.roleInfo);
        this.sceneUtil.enableRole(this.close);
        this.sceneUtil.enableRole(this.line);

        switch (this.nowRole) {
            case OpKind.warrior:
                this.sceneUtil.disableRole(this.warrior);
                this.infoWarArr.forEach(v => {
                    v.visible = true;
                });
                break;
            case OpKind.tank:
                this.sceneUtil.disableRole(this.tank);
                this.infoTankArr.forEach(v => {
                    v.visible = true;
                });
                break;
            case OpKind.mage:
                this.sceneUtil.disableRole(this.mage);
                this.infoMageArr.forEach(v => {
                    v.visible = true;
                });
                break;
        }
        this.opRepo.setUserRole(this.nowRole);
    }
    /**關閉選角視窗
     * 
     * @param name 角色
     */
    private closeRoleInfo(): void {
        this.sceneUtil.disableRole(this.roleInfo);
        this.sceneUtil.disableRole(this.close);
        this.sceneUtil.disableRole(this.line);

        switch (this.nowRole) {
            case OpKind.warrior:
                this.sceneUtil.disableRole(this.warrior);
                this.infoWarArr.forEach(v => {
                    v.visible = false;
                });
                break;
            case OpKind.tank:
                this.sceneUtil.disableRole(this.tank);
                this.infoTankArr.forEach(v => {
                    v.visible = false;
                });
                break;
            case OpKind.mage:
                this.sceneUtil.disableRole(this.mage);
                this.infoMageArr.forEach(v => {
                    v.visible = false;
                });
                break;
        }
    }
    /**確定角色
     * 
     */
    private next(): void {
        if (this.isOpenInfo === false) {
            this.nextText.setText('請先選角色');
            return;
        }

        this.game.scene.start("PlayScene");
        this.game.scene.remove("RolesScene");
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
     *  生成物件
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

        // 6. 下一頁按鈕
        this.add.sprite(width + 250, 270, "gameStart")
            .setScale(0.5, 0.4)
            .setInteractive()
            .on("pointerdown", () => {
                this.next();
            });

        this.nextText = this.add.text(width + 40, 250, '', SceneUtil.textStyle());

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
        this.sceneUtil.disableRole(this.roleInfo);
        this.sceneUtil.disableRole(this.close);

        this.line = this.add
            .sprite(width - 30, 150, "line")
            .setScale(1, 0.8);

        this.physics.world.enable(this.line);
        this.line.body.allowGravity = false;
        this.lineStartX = this.line.x;
        this.lineStartY = this.line.y;
        this.sceneUtil.disableRole(this.line);

        // 6. 建立角色
        this.createAllRole();

        // 7. 建立角色資訊
        this.createRoleInfo();
    }
}