


export class GameScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Sprite;


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
    }

    /**
    * 場景跳轉
    */
    startGame(): void {
        this.game.scene.start("RolesScene");
    }
}
