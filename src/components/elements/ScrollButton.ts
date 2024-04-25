
import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";

export class ScrollButton extends Button{
    public scene: BaseScene;
    private static FORWARD: number = 0;
    private static BACKWARD: number = 1;
    public mode: number = 0;
    public mySprite: Phaser.GameObjects.Sprite;
    constructor(scene: BaseScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.mySprite = new Phaser.GameObjects.Sprite(scene, x, y, "next_button");
        this.add(this.mySprite);
        this.bindInteractive(this.mySprite);
        this.setInteractive();
    }

    setForward(){
        this.mode = ScrollButton.FORWARD;
        this.mySprite.setScale(1,1);
    }

    setBackward(){
        this.mode = ScrollButton.BACKWARD;
        this.mySprite.setScale(-1,1);
    }

    veil(){
        this.disableInteractive();
        this.setAlpha(0.35);
    }

    unVeil(){
        this.setInteractive();
        this.setAlpha(1);
    }

    hide(){
        this.disableInteractive();
        this.setAlpha(0);
    }

    unhide(){
        this.setInteractive();
        this.setAlpha(1);
    }

    onDown(){
        this.mySprite.setFrame(1);
        this.scene.sound.play("scroll");
        if(this.mode == 0) {
            this.scene.scrollForward();
        } else if (this.mode == 1) {
            this.scene.scrollBackward();
        }
    }

    onUp(){
        this.mySprite.setFrame(0);
    }
    
}