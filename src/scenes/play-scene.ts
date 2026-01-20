import { BadGuy, SetBadGuy, Masters } from "../masters/index";
import { Warrior, Tank, Mage, SetWarrior, SetTank, SetMage, occupation, HealthBar, HealthService, healthEvents, ManaBar, ManaService, manaEvents, LevelBar, LevelService, levelEvents } from "../occupations/index";
import { LocalStorageDao } from "../dao/index";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";
import { SceneUtil } from "../utils/index";
import { AbilityDto, OpKind, Direction } from "../models/index";


import { enemyAIEvents } from "../occupations/gameMechanics/ai/enemy.ai.events";


export class PlayScene extends Phaser.Scene {
    private sceneUtil: SceneUtil;
    private readonly opRepo: OccupationRepo;
    private hpBar: HealthBar;
    private hpService: HealthService;
    private manaBar: ManaBar;
    private manaService: ManaService;
    private levelBar: LevelBar;
    private levelService: LevelService;
    private badguy: Phaser.GameObjects.Sprite;
    private user: Phaser.GameObjects.Sprite;
    private bgy: Masters;
    private userRole: occupation;
    private userChose: OpKind;
    private isMoving: boolean = false;
    private lastDirection: Direction;
    private isAck: boolean = false;
    private skillNameText: Phaser.GameObjects.Text;
    private userAbility: AbilityDto;

    private isMobile: boolean;
    private leftButton: Phaser.GameObjects.Sprite;
    private rightButton: Phaser.GameObjects.Sprite;
    private upButton: Phaser.GameObjects.Sprite;
    private downButton: Phaser.GameObjects.Sprite;
    private skillButton: Phaser.GameObjects.Sprite;

    private unsubscribeHealthEvents: () => void;
    private unsubscribeManaEvents: () => void;
    private unsubscribeXpEvents: () => void;
    private unsubscribeLevelUpEvents: () => void;
    private unsubscribeAI: () => void;

    constructor() {
        super({
            key: "PlayScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao());
        this.sceneUtil = new SceneUtil(this);

    }

    shutdown() {
        if (this.unsubscribeHealthEvents) {
            this.unsubscribeHealthEvents();
        }
        if (this.unsubscribeManaEvents) {
            this.unsubscribeManaEvents();
        }
        if (this.unsubscribeXpEvents) {
            this.unsubscribeXpEvents();
        }
        if (this.unsubscribeLevelUpEvents) {
            this.unsubscribeLevelUpEvents();
        }
        if (this.unsubscribeAI) {
            this.unsubscribeAI();
        }
        // Also shut down the BadGuy's AI if it has a shutdown method
        if (this.bgy && typeof this.bgy.shutdown === 'function') {
            this.bgy.shutdown();
        }
    }

    private createStatus(): void {
        const userHealth: number = this.userAbility.health;
        console.log('user hp', userHealth);
        this.hpService = new HealthService(userHealth);
        this.hpBar = new HealthBar(this, 500, 20);
        this.hpBar.draw(this.hpService.getHealth(), this.hpService.getMaxHealth());

        this.unsubscribeHealthEvents = healthEvents.on('health-changed', (currentHealth: number, maxHealth: number) => {
            this.hpBar.draw(currentHealth, maxHealth);
        });

        const userMana: number = this.userAbility.magic || 100; // Assuming mana ability might be missing, default to 100
        this.manaService = new ManaService(userMana);
        this.manaBar = new ManaBar(this, 500, 40); // Position below health bar
        this.manaBar.draw(this.manaService.getMana(), this.manaService.getMaxMana());

        this.unsubscribeManaEvents = manaEvents.on('mana-changed', (currentMana: number, maxMana: number) => {
            this.manaBar.draw(currentMana, maxMana);
        });

        this.levelService = new LevelService(); // Assuming initial level 1, 0 XP
        this.levelBar = new LevelBar(this, 500, 60); // Position below mana bar
        this.levelBar.draw(this.levelService.getCurrentXp(), this.levelService.getXpForNextLevel(), this.levelService.getLevel());

        this.unsubscribeXpEvents = levelEvents.on('xp-changed', (currentXp: number, xpForNextLevel: number, currentLevel: number) => {
            this.levelBar.draw(currentXp, xpForNextLevel, currentLevel);
        });
        this.unsubscribeLevelUpEvents = levelEvents.on('level-up', (level: number) => {
            console.log(`Leveled up to: ${level}`);
            // Potentially show a level up effect or message
        });

        this.unsubscribeAI = enemyAIEvents.on('enemy-attack', (enemyId: string, playerPosition: { x: number, y: number }) => {
            if (this.bgy && this.badguy) { // Ensure BadGuy instance and sprite exist
                console.log(`${this.bgy.name} (${enemyId}) attacks player at:`, playerPosition);
                this.bgy.skills(this, this.badguy); // Trigger BadGuy's attack animation
                this.hpService.takeDamage(this.userAbility.attack); // Player takes damage
            }
        });
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

        // 讀取能力值
        this.userAbility = this.userRole.getAbility();

        this.createStatus();
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

        // AI update for BadGuy
        // Assuming player and enemy have position properties
        const playerPosition = { x: this.user.x, y: this.user.y };
        const enemyPosition = { x: this.badguy.x, y: this.badguy.y };
        this.bgy.aiUpdate(time, playerPosition, enemyPosition);


        // 技能 (temporarily add XP and use mana for testing)
        if (cursorKeys.space.isDown) {
            const sk = this.userRole.skills(this, this.user);
            this.skillNameText.setText('Skill: ' + sk);
            this.hpService.takeDamage(5);
            if (this.manaService.useMana(10)) { // Use mana if available
                this.levelService.addXp(20); // Gain XP when using skill and mana
            }
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