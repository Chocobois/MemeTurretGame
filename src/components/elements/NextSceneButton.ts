import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "./Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";

export class NextSceneButton extends Button{
    public scene: BaseScene;
    public sp: Phaser.GameObjects.Image
    constructor(scene: BaseScene, x: number, y: number){
        super(scene, x, y);
        this.scene = scene;
        this.sp = this.scene.add.image(0,0,"next_scene_button");
        this.add(this.sp);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.bindInteractive(this.sp);
        this.setInteractive()
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.scene.sound.play("scroll");
        this.scene.nextScene();
    }

    veil(){
        this.sp.setAlpha(0.5);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.sp.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
    }

}