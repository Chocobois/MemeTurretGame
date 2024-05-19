import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";

export class ParticleEffect extends Effect {
    private t: number[] = [5000,5000];
    private spin: number = 120;
    private spr: Phaser.GameObjects.Image;
    private v: number[] = [0,0];
    private accel: number[] = [0,0];
    constructor(scene: BaseScene, x:number, y:number, sp: string, vel: number[], a: number[]) {
        super(scene,x,y);
        this.spr = this.scene.add.image(0,0,sp);
        this.spr.setOrigin(0.5,0.5);
        this.add(this.spr);
        this.scene.add.existing(this);
        this.v = vel;
        this.accel = a;
        this.spin = -720+(Math.random()*1440);
        this.setDepth(3);
        this.spr.setDepth(3);
    }

    update(d:number, t:number) {
        if(this.t[0] > 0) {
            this.t[0] -= d;
            this.v[0] += this.accel[0]*d/500;
            this.v[1] += this.accel[1]*d/500;
            this.x += this.v[0]*d/500;
            this.y += this.v[1]*d/500;
            if(this.t[0]<=0){
                this.deleteFlag = true;
                this.spr.setVisible(false);
            } else {
                this.setAngle(this.angle+(this.spin*d/1000));
                this.spr.setAlpha(this.t[0]/this.t[1]);
            }
        }
    }
}