import "phaser";
import { GameScene } from "./scenes/game-scene";
import { RolesScene } from "./scenes/roles-scene";
import { PlayScene } from "./scenes/play-scene";

let config: GameConfig = {
    width: 600,
    height: 300,
    parent: "game",
    //scene: [GameScene, RolesScene, PlayScene],
    scene: [PlayScene, GameScene, RolesScene],
    input: {
        keyboard: true
    },
    physics: {
        default: "arcade",
        arcade: {
            // debug: true,
            gravity: { y: 300 }
        }
    },
    render: { pixelArt: true }
}



export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}


window.addEventListener("load", () => {
    let game: Game = new Game(config);
    function resize(): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        let ww: number = window.innerWidth;
        let wh: number = window.innerHeight;
        let wRatio: number = ww / wh;
        let gameRatio: number = <number>config.width / <number>config.height;
        if (wRatio < gameRatio) {
            canvas.style.width = ww + "px";
            canvas.style.height = ww / gameRatio + "px";
        } else {
            canvas.style.width = wh * gameRatio + "px";
            canvas.style.height = wh + "px";
        }
    }
    resize();
    window.addEventListener("resize", resize, false); // 偵聽事件 resize
});