import { LocalStorageDao } from "../dao/localStorageDao";
import { OccupationRepo, OccupationRepository } from "../repository/occupationRepository";
import { AbilityDto } from "../models/dtos/abilityDto";

export class GameScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Sprite;
    private readonly opRepo: OccupationRepo;

    constructor() {
        super({
            key: "GameScene"
        });
        this.opRepo = new OccupationRepository(new LocalStorageDao);
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
        this.opRepo.createRole(this.createNewRole());
        this.game.scene.start("RolesScene");
        this.game.scene.remove("GameScene");
    }

    /**
     * 建立角色
     * 隨機產生數值
     * @returns 
     */
    private createNewRole(): AbilityDto {
        let ability: AbilityDto = new AbilityDto();
        ability.level = 1;
        ability.health = this.random(1000, 2000);
        ability.magic = this.random(500, 1000);
        ability.actionPoint = this.random(100, 500);
        ability.strength = this.random(30, 100);
        ability.intelligence = this.random(30, 100);
        ability.accuracy = this.random(30, 100);
        ability.luck = this.random(30, 100);
        ability.agility = this.random(30, 100);
        ability.attack = this.random(30, 100);
        ability.mattack = this.random(30, 100);
        return ability;
    }

    /**
     * 取得亂數
     * @param min 
     * @param max 
     * @returns 兩者之間的整數亂數
     */
    private random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}
