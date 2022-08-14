
import { Warrior } from "../occupations/warrior";
import { Tank } from "../occupations/tank";
import { Mage } from "../occupations/mage";
import { SetWarrior } from "../occupations/setOccupations/setWarrior";
import { SetTank } from "../occupations/setOccupations/setTank";
import { SetMage } from "../occupations/setOccupations/setMage";

export class GameScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Sprite;
    private warrior: Phaser.GameObjects.Sprite;
    private tank: Phaser.GameObjects.Sprite;
    private mage: Phaser.GameObjects.Sprite;
    private keyboard: Phaser.Input.Keyboard.CursorKeys;
    private wrr: Warrior;
    private tan: Tank;
    private mag: Mage;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    /**
     * 初始化
    */
    init(): void {

    }
    /**
     * 載入素材
     */
    preload(): void {
        this.load.pack(
            "flappyBirdPack",
            "./src/assets/pack.json",
            "flappyBirdPack"
        );
    }

    /**
    * 生成物件
    */
    create(): void {
        // 1. 背景

        //取得寬高
        let width: number = <number>this.sys.game.config.width / 2;
        let height = <number>this.sys.game.config.height / 2;
        let bg: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, "background");
        //設定位置
        bg.setPosition(width, height);

        this.add.sprite(width, height - 50, "gameName", 0);

        let start: Phaser.GameObjects.Sprite = this.add
            .sprite(width, height + 50, "start", 0)
            .setInteractive();

        start.on("pointerdown", () => {
            this.startGame();
        });

        this.warrior = new SetWarrior({
            scene: this,
            x: 50,
            y: 50,
            frame: 0,
            key: "warrior"
        });

        this.wrr = new Warrior();

        this.tank = new SetTank({
            scene: this,
            x: 50,
            y: 120,
            frame: 0,
            key: "tank"
        });

        this.tan = new Tank();

        this.mage = new SetMage({
            scene: this,
            x: 50,
            y: 250,
            frame: 0,
            key: "mage"
        });

        this.mag = new Mage();

        this.keyboard = this.input.keyboard.createCursorKeys()
    }

    update(time: number, delta: number): void {
        if (this.keyboard.right.isDown) {
            this.wrr.walk(this, "right");
            this.tan.walk(this, "right");
            this.mag.walk(this, "right");

        } else if (this.keyboard.left.isDown) {
            this.wrr.walk(this, "left");
            this.tan.walk(this, "left");
            this.mag.walk(this, "left");
        }
        else if (this.keyboard.down.isDown) {
            this.wrr.walk(this, "down");
            this.tan.walk(this, "down");
            this.mag.walk(this, "down");
        }
        else if (this.keyboard.up.isDown) {
            this.wrr.walk(this, "up");
            this.tan.walk(this, "up");
            this.mag.walk(this, "up");
        }
        else {
            this.wrr.skills(this);
            this.tan.skills(this);
            this.mag.skills(this);
        }
    }

    /**
    * 場景跳轉
    */
    startGame(): void {
        this.game.scene.start("alpacaScene");
    }
}