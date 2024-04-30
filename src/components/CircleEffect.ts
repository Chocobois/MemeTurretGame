import { GameScene } from "@/scenes/GameScene";
import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";

export class CircleEffect extends Effect{
    public draw: Phaser.GameObjects.Graphics;
    public myColor: number;
    public duration: number;
    public timer: number = 0;
    public rad: number = 100;
    public thick: number = 20;
    public txp: number = 1;
    public deleteFlag: boolean = false;
    //public myImg: Phaser.GameObjects.Image;
    constructor(scene: BaseScene, x: number, y: number, time: number, radius: number, color: number = 0xFFFFFF, stroke: number = 20, alpha: number = 0.75) {
        super(scene,x,y);
        this.duration = time;
        this.timer = this.duration;
        this.thick = stroke;
        this.rad = radius;
        this.myColor = color;
        //this.myImg = this.scene.add.image(0,0,"coin");
        this.draw = this.scene.add.graphics();
        this.txp = alpha;
        this.draw.lineStyle(this.thick, this.myColor, this.txp);
        this.add(this.draw);
        //this.add(this.myImg);
        this.scene.add.existing(this);
    }

    update(d: number, t: number) {
        if(this.timer > 0) {
            this.timer -= d;
            if(this.timer <= 0) {
                this.timer = 0;
                this.draw.clear();
                this.deleteFlag = true;
            } else {
                this.draw.clear();
                this.draw.lineStyle(this.thick, this.myColor, this.txp*(1-(this.timer/this.duration)));
                this.draw.beginPath();
                this.draw.arc(0,0,(this.rad*(this.timer/this.duration)),0,360,false,0.01);
                this.draw.closePath();
                this.draw.strokePath();
            }
        }
    }
}