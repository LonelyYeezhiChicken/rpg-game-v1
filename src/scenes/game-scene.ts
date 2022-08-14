
import { Warrior } from "../occupations/warrior";
import { Tank } from "../occupations/tank";
import { SetWarrior } from "../occupations/setOccupations/SetWarrior";
import { SetTank } from "../occupations/setOccupations/SetTank";

export class GameScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Sprite;
    private warrior: Phaser.GameObjects.Sprite;
    private tank: Phaser.GameObjects.Sprite;
    private keyboard: Phaser.Input.Keyboard.CursorKeys;
    private wrr: Warrior;
    private tan: Tank;

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
            y: 100,
            frame: 0,
            key: "warrior"
        });

        this.wrr = new Warrior();

        this.tank = new SetTank({
            scene: this,
            x: 50,
            y: 200,
            frame: 0,
            key: "tank"
        });

        this.tan = new Tank();

        this.keyboard = this.input.keyboard.createCursorKeys()
    }

    update(time: number, delta: number): void {
        if (this.keyboard.right.isDown) {
            this.wrr.walk(this, "right");
            this.tan.walk(this, "right");

        } else if (this.keyboard.left.isDown) {
            this.wrr.walk(this, "left");
            this.tan.walk(this, "left");
        }
        else if (this.keyboard.down.isDown) {
            this.tan.dead(this);
        }
        else if (this.keyboard.up.isDown) {
            this.tan.skills(this);
        }
        else {
            this.wrr.skills(this);
            this.tan.skills(this);
        }
    }

    /**
    * 場景跳轉
    */
    startGame(): void {
        this.game.scene.start("alpacaScene");
    }
}