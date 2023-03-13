export class SceneUtil {
    private scene: { physics: { world: { disable: (arg0: Phaser.GameObjects.Sprite) => void; enable: (arg0: Phaser.GameObjects.Sprite) => void; }; }; };

    constructor(scene: any) {
        this.scene = scene;
    }


    /** 文字 style
       * 
       * @returns 
       */
    public static textStyle(): any {
        return {
            font: "32px Arial",
            fill: "#FAFFFE",
            align: "left",
            backgroundColor: "#344648"
        }
    }
    /**隱形角色 */
    public disableRole(role: Phaser.GameObjects.Sprite): void {
        role.alpha = 0;//透明度設為 0 
        this.scene.physics.world.disable(role)//刪除物理性質
    }
    /**顯示角色 */
    public enableRole(role: Phaser.GameObjects.Sprite): void {
        role.alpha = 100;//透明度設為 100 
        this.scene.physics.world.enable(role)//恢復物理性質        
    }
}