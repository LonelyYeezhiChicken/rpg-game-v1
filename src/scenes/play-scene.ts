import { BadGuy, SetBadGuy, Masters } from "../masters/index";
import { OpKind, Direction } from "../models/enums/index";
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
    private isMoving: boolean = false;
    private lastDirection: Direction;
    private isAck: boolean = false;
    private skillNameText: Phaser.GameObjects.Text;

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

        this.skillNameText = this.add.text(10, 10, '', { font: '16px Arial', fill: '#ffffff' });
        this.userChose = this.opRepo.getUserRole();
        // 2. 建立角色
        this.createAllRole();

        this.bgy = new BadGuy();
        //this.bgy.walk(this, this.badguy, Direction.left);
        this.bgy.skills(this, this.badguy);
        this.bgy.stop(this, this.badguy, Direction.left);
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
        // this.userRole.walk(this, this.user, Direction.right);
        //this.userRole.dead(this, this.user);
        this.userRole.stop(this, this.user, Direction.right);
    }

    update(time: number, delta: number): void {
        const cursorKeys = this.input.keyboard.createCursorKeys();

        // 走路
        if (cursorKeys.left.isDown || cursorKeys.right.isDown || cursorKeys.up.isDown || cursorKeys.down.isDown) {
            if (cursorKeys.left.isDown) {
                this.userRole.walk(this, this.user, Direction.left);
                this.lastDirection = Direction.left;
            } else if (cursorKeys.right.isDown) {
                this.userRole.walk(this, this.user, Direction.right);
                this.lastDirection = Direction.right;
            } else if (cursorKeys.up.isDown) {
                this.userRole.walk(this, this.user, Direction.up);
            } else if (cursorKeys.down.isDown) {
                this.userRole.walk(this, this.user, Direction.down);
            }
            this.isMoving = true;
        } else {
            if (this.isMoving) {
                this.userRole.stop(this, this.user, this.lastDirection);
                this.isMoving = false;
            }
        }

        // 技能
        if (cursorKeys.space.isDown) {
            const sk = this.userRole.skills(this, this.user);
            console.log('skill Name', sk);
            this.skillNameText.setText('Skill: ' + sk);
            this.isAck = true;
        } else {
            if (this.isAck) {
                this.userRole.stop(this, this.user, this.lastDirection);
                this.skillNameText.setText('');
                this.isAck = false;
            }
        }
    }

}