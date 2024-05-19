import { Effect } from "./Effect";
import { BaseScene } from "@/scenes/BaseScene";

export class TitleEffect extends Effect{
    public img: Phaser.GameObjects.Image;
    public fIn: number[] = [2000,2000];
    public wt: number[] = [0,5000];
    public fOut:number[] = [0,2000];
    constructor(scene:BaseScene,x:number,y:number, img: string){
        super(scene,x,y);
        this.img=this.scene.add.image(0,0,img);
        this.img.setAlpha(0);
        this.img.setOrigin(0,0);
        this.add(this.img);
        this.scene.add.existing(this);
        this.setDepth(4);
        this.img.setDepth(4);
    }

    update(d:number, t:number){
        if(this.fIn[0] > 0) {
            this.fIn[0] -= d;
            if(this.fIn[0] <= 0) {
                this.wt[0] = this.wt[1];
                this.img.setAlpha(1);
            } else {
                this.img.setAlpha(1-(this.fIn[0]/this.fIn[1]));
            }
        }

        if(this.wt[0] > 0) {
            this.wt[0] -= d;
            if(this.wt[0] <= 0) {
                this.fOut[0] = this.fOut[1];
            }
        }

        if(this.fOut[0] > 0) {
            this.fOut[0] -= d;
            if(this.fOut[0] <= 0) {
                this.deleteFlag = true;
                this.img.setAlpha(0);
            } else {
                this.img.setAlpha(this.fOut[0]/this.fOut[1]);
            }
        }
    }
}