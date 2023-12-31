import { BadGuy, SetBadGuy, Masters } from "../masters/index";
import { OpKind, Direction } from "../models/enums/index";
import { Warrior, Tank, Mage, SetWarrior, SetTank, SetMage, occupation } from "../occupations/index";
import { LocalStorageDao } from "../dao/index";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";
import { SceneUtil } from "../utils/index";


export class PlayScene extends Phaser.Scene {
    private sceneUtil: SceneUtil;
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

    private isMobile: boolean;
    private leftButton: Phaser.GameObjects.Sprite;
    private rightButton: Phaser.GameObjects.Sprite;
    private upButton: Phaser.GameObjects.Sprite;
    private downButton: Phaser.GameObjects.Sprite;
    private skillButton: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: "PlayScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao());
        this.sceneUtil = new SceneUtil(this);

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

        this.isMobile = this.sys.game.device.os.iOS || this.sys.game.device.os.android;
        // 1. 背景
        // 取得寬高
        let width: number = <number>this.sys.game.config.width / 2;
        let height = <number>this.sys.game.config.height / 2;
        let bg: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, "background2");
        // 設定位置
        bg.setPosition(width, height);

        this.skillNameText = this.add.text(10, 10, '', SceneUtil.textStyle());
        this.userChose = this.opRepo.getUserRole();
        // 2. 建立角色
        this.createAllRole();

        this.bgy = new BadGuy();
        this.bgy.skills(this, this.badguy);
        this.bgy.stop(this, this.badguy, Direction.left);

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
        this.userRole.stop(this, this.user, Direction.right);

        // 手機版
        if (this.isMobile) {
            const w = <number>this.sys.game.config.width - 50;
            const h = <number>this.sys.game.config.height - 50;

            this.leftButton = this.add.sprite(50, h, 'direction')
                .setScale(0.5, 0.3)
                .setAngle(90)
                .setInteractive();

            this.rightButton = this.add.sprite(150, h, 'direction')
                .setScale(0.5, 0.3)
                .setAngle(270)
                .setInteractive();

            this.upButton = this.add.sprite(100, h - 25, 'direction')
                .setScale(0.5, 0.3)
                .setAngle(180)
                .setInteractive();

            this.downButton = this.add.sprite(100, h + 25, 'direction')
                .setScale(0.5, 0.3)
                .setInteractive();

            this.skillButton = this.add.sprite(w, h, 'ack')
                .setScale(0.5, 0.5)
                .setInteractive();

            this.leftButton.on('pointerdown', () => this.handleMove(Direction.left, true));
            this.rightButton.on('pointerdown', () => this.handleMove(Direction.right, true));
            this.upButton.on('pointerdown', () => this.handleMove(Direction.up, true));
            this.downButton.on('pointerdown', () => this.handleMove(Direction.down, true));
            this.skillButton.on('pointerdown', () => this.handleSkill(true));

            this.leftButton.on('pointerup', () => this.handleMove(Direction.left, false));
            this.rightButton.on('pointerup', () => this.handleMove(Direction.right, false));
            this.upButton.on('pointerup', () => this.handleMove(Direction.up, false));
            this.downButton.on('pointerup', () => this.handleMove(Direction.down, false));
            this.skillButton.on('pointerup', () => this.handleSkill(false));
        }
    }


    private handleMove(direction: Direction, isDown: boolean): void {
        switch (direction) {
            case Direction.left:
                if (isDown)
                    this.input.keyboard.createCursorKeys().left.isDown = true;
                else
                    this.input.keyboard.createCursorKeys().left.isDown = false;
                break;
            case Direction.right:
                if (isDown)
                    this.input.keyboard.createCursorKeys().right.isDown = true;
                else
                    this.input.keyboard.createCursorKeys().right.isDown = false;
                break;
            case Direction.up:
                if (isDown)
                    this.input.keyboard.createCursorKeys().up.isDown = true;
                else
                    this.input.keyboard.createCursorKeys().up.isDown = false;
                break;
            case Direction.down:
                if (isDown)
                    this.input.keyboard.createCursorKeys().down.isDown = true;
                else
                    this.input.keyboard.createCursorKeys().down.isDown = false;
                break;
        }
    }

    private handleSkill(isDown: boolean): void {
        if (isDown)
            this.input.keyboard.createCursorKeys().space.isDown = true;
        else
            this.input.keyboard.createCursorKeys().space.isDown = false;
    }

    /**電腦版走路
     * 
     * @param cursorKeys 
     */
    private pcController(cursorKeys: Phaser.Input.Keyboard.CursorKeys): void {


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