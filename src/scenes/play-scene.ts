import { BadGuy, SetBadGuy, Masters } from "../masters/index";
import { OpKind } from "../models/enums/opKind";
import { Warrior, Tank, Mage, SetWarrior, SetTank, SetMage, occupation } from "../occupations/index";
import { LocalStorageDao } from "../dao/index";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";


export class PlayScene extends Phaser.Scene {
    private readonly opRepo: OccupationRepo;
    private badguy: Phaser.GameObjects.Sprite;
    private user: Phaser.GameObjects.Sprite;
    private bgy: Masters;
    private userRole: occupation;
    private userChose: OpKind;
    private pointStart: number;


    constructor() {
        super({
            key: "PlayScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao());
    }

    /** 建立角色
     * 
     */
    private createAllRole(): void {
        // 新增角色(反派)
        this.badguy = new SetBadGuy({
            scene: this,
            x: 500,
            y: 150,
            frame: 0,
            key: "badGuy"
        });

        this.badguy.body.flipX = false;

        // 主角
        switch (this.userChose) {
            case OpKind.warrior:
                this.user = new SetWarrior({
                    scene: this,
                    x: 100,
                    y: 150,
                    frame: 0,
                    key: "warrior"
                });
                break;
            case OpKind.tank:
                this.user = new SetTank({
                    scene: this,
                    x: 200,
                    y: 150,
                    frame: 0,
                    key: "tank"
                });
                break;
            case OpKind.mage:
                this.user = new SetMage({
                    scene: this,
                    x: 100,
                    y: 170,
                    frame: 0,
                    key: "mage"
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

        this.load.pack(
            "RpgGame",
            "./src/assets/pack.json",
            "RpgGame"
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


        this.userChose = this.opRepo.getUserRole();
        // 2. 建立角色
        this.createAllRole();

        this.bgy = new BadGuy();
        //this.bgy.walk(this, this.badguy, 'left');
        this.bgy.skills(this, this.badguy);
        //this.bgy.dead(this, this.badguy);

        switch (this.userChose) {
            case OpKind.warrior:
                this.userRole = new Warrior();
                break;
            case OpKind.tank:
                this.userRole = new Tank();
                break;
            case OpKind.mage:
                this.userRole = new Mage();
                break;
        }
        this.userRole.walk(this, this.user, 'right');
        // this.userRole.dead(this, this.user);
    }
}