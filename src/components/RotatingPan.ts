import { EnemyBulletParam, EnemyProjectile } from "./EnemyProjectile";
import { GameScene } from "@/scenes/GameScene";


export class RotatingPan extends EnemyProjectile {
    public travelTime: number = 750;
    public spaztime: number = 0;
    public offset: number = 0;
    public sAngle: number = 0;
    public newV: number = 0;
    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, ofs: number = 0, newv: number = 0) {
        super(scene,x,y,angle,info);
        this.pierce = true;
        this.offset = ofs;
        this.sAngle = angle;
        this.newV = newv;
    }

    update(d: number) {
        super.update(d);
        if(this.travelTime > 0) {
            this.travelTime -= d;
            if(this.travelTime <= 0) {
                this.spaztime = 500;
                this.velocity[0] = 0;
                this.velocity[1] = 1;
            }
        }
        if(this.spaztime > 0) {
            this.spaztime -= d;
            if(this.spaztime < 0) {
                this.scene.sound.play("pansound", {volume:0.025});
                let sz = this.sAngle + this.offset;
                this.velocity[0] = this.newV*Math.cos(sz);
                this.velocity[1] = this.newV*Math.sin(sz);
                this.setAngle(sz*(180/Math.PI));
            } else {
                this.setAngle(Math.random()*360);
            }
        }
    }
}