import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { CircleEffect } from "./CircleEffect";
import { BasicEffect } from "./BasicEffect";
import { Knight} from "./Knight";

export class Trojan extends Enemy {
    private tTime: number = 2000;
    private rTime: number = 0;
    constructor(scene:GameScene,x:number,y:number,type:number) {
        super(scene,x,y,type);
        this.tTime = 1000+Math.random()*2000;

    }


    update(d:number, t:number){
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }
        this.updateAngle();
        //this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
    }

    updateMovement(d: number, t: number): void {
        if(this.tTime > 0) {
            this.tTime -= d;
            this.x += this.myInfo.vx*d/1000;
            if(this.tTime <= 0) {
                this.rTime = 1000;
                this.scene.addHitEffect(new CircleEffect(this.scene,this.x,this.y,1000,350,0xFFFFFF,20,0.8));
            }
        }

        if(this.rTime > 0) {
            this.rTime -= d;
            if(this.rTime <= 0){
                this.mySprite.setVisible(false);
                this.scene.sound.play("meme_explosion_sound");
                this.scene.addHitEffect(new BasicEffect(this.scene,"explosion_tiny",this.x,this.y,6,110,false,0,0,0.75));
                this.scene.pushEnemy(new Knight(this.scene,this.x,this.y,22,0));
                this.scene.pushEnemy(new Knight(this.scene,this.x,this.y,22,1.5));
                this.scene.pushEnemy(new Knight(this.scene,this.x,this.y,22,-1.5));
                //this.scene.pushEnemy(new Knight(this.scene,this.x,this.y,22,2));
                //this.scene.pushEnemy(new Knight(this.scene,this.x,this.y,22,-2));
                this.deleteFlag = true;
            }
        }
    }
}