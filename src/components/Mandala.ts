import { GameScene } from "@/scenes/GameScene"
import { Boss } from "./Boss";

export class Mandala extends Phaser.GameObjects.Container {
    public scene:GameScene;
    public mandala: Phaser.GameObjects.Image
    public theta: number = 0;
    public mtimer: number = 1000;
    public maxTimer: number = 1000;
    public mscale: number = 1;
    public curAlpha: number = 1;
    public fadeTimer: number = -1;
    public maxFade: number = -1;
    public curAngle: number = 0;
    public deleteFlag: boolean = false;
    public owner: Boss;

    constructor(scene:GameScene, x:number, y:number, pt: Boss, tex:string, maxscale: number, rotation:number, expandtime: number, alpha: number=1, initsound: boolean = false, sound: string = "charge_big") {
        super(scene,x,y);
        this.owner = pt;
        this.scene=scene;
        this.mandala = this.scene.add.image(0,0,tex);
        this.mandala.setScale(0.0001);
        this.mandala.setOrigin(0.5,0.5);
        this.curAlpha = alpha;
        this.mandala.setAlpha(alpha);
        this.curAngle = Math.random()*360;
        this.mandala.setAngle(this.curAngle);
        this.maxTimer = expandtime;
        this.mtimer=expandtime;
        this.mscale = maxscale;
        this.theta = rotation;
        this.add(this.mandala);
        this.scene.add.existing(this);
        this.setDepth(-1);
        if(initsound) {
            this.scene.sound.play(sound,{volume: 0.5});
        }
    }

    update(d: number, t: number) {
        this.x = this.owner.x;
        this.y = this.owner.y
        this.curAngle += (this.theta*d/1000);
        if(this.curAngle > 360) {
            this.curAngle -=360;
        } else if(this.curAngle < -360) {
            this.curAngle += 360;
        }
        this.setAngle(this.curAngle);

        if(this.mtimer > 0) {
            this.mtimer -= d; 
            if(this.mtimer <= 0) {
                this.mtimer = 0;
            }
            let sc = this.mscale*(1-(this.mtimer/this.maxTimer));
            this.mandala.setScale(sc,sc);
        }
        if(this.fadeTimer > 0) {
            this.fadeTimer -= d;
            if(this.fadeTimer <= 0) {
                this.mandala.setVisible(false);
                this.deleteFlag = true;
            } else {
                this.mandala.setAlpha(this.curAlpha*(this.fadeTimer/this.maxFade));
            }
        }
    }

    setFade(n: number) {
        this.fadeTimer = n;
        this.maxFade = n;
    }
}