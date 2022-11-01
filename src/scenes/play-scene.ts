import { BadGuy, SetBadGuy, Masters } from "../masters/index";

export class PlayScene extends Phaser.Scene {
    private badguy: Phaser.GameObjects.Sprite;
    private bgy: Masters;


    constructor() {
        super({
            key: "PlayScene"
        });
    }

    /** 建立角色
     * 
     */
    private createAllRole(): void {
        // 新增角色
        this.badguy = new SetBadGuy({
            scene: this,
            x: 500,
            y: 150,
            frame: 0,
            key: "badGuy"
        });

        this.badguy.body.flipX = false;
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

        // 2. 建立角色
        this.createAllRole();

        this.bgy = new BadGuy();
        //this.bgy.walk(this, this.badguy, 'left');
        this.bgy.skills(this, this.badguy);
        //this.bgy.dead(this, this.badguy);
    }
}