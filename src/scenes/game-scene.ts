
import { Warrior, SetWarrior } from "../occupations/warrior";

export class GameScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Sprite;
    private warriors: Phaser.GameObjects.Group;
    private warrior: Phaser.GameObjects.Sprite;
    private wd: Warrior;

    private addWarrior(x: number, y: number, frame: number): void {

        // create a new pipe at the position x and y and add it to group
        this.warriors.add(
            new SetWarrior({
                scene: this,
                x: x,
                y: y,
                frame: frame,
                key: "warrior"
            })
        );
    }

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


        this.warrior = new SetWarrior({
            scene: this,
            x: 100,
            y: 100,
            frame: 1,
            key: "warrior"
        });
        this.wd = new Warrior();
        console.log(this.wd.occupationName);
        this.wd.dead(this);

        //this.warrior.anims.play('right', true);

        // this.warrior = this.add.sprite(50, 255, "man", 0).setInteractive();
        // this.input.setDraggable(this.warrior);

        // this.warriors = this.add.group({ classType: Warrior });

        // this.addWarrior(20, 10, 0);
        // this.addWarrior(200, 100, 1);

        start.on("pointerdown", () => {
            this.startGame();
        });
    }


    /**
    * 場景跳轉
    */
    startGame(): void {
        this.game.scene.start("alpacaScene");
    }
}