import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { TextEffect } from "./TextEffect";
import { BasicEffect } from "./BasicEffect";

export class Turtle extends Enemy{
    private dur: number = 10000;
    private cr: number = 160;
    private hasCollided: number = 0;

    constructor(scene:GameScene,x:number,y:number,type:number){
        super(scene,x,y,type);
        let r = Math.random()*2*Math.PI;
        let br = 800+(Math.random()*400);
        this.velocity = [Math.cos(r)*br,Math.sin(r)*br];
    }

    update(d: number, t: number){
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
        this.scene.customProjUpdate(this,this.cr);

        if(this.dur > 0) {
            this.dur -= d;
            if(this.dur <= 0) {
                this.die();
            }
        }
        if(this.hasCollided >= 0) {
            this.hasCollided -= d;
        } else {
            this.collideT();
        }
    }

    collideT(){
        if(Math.hypot(this.scene.activeTurret.x-this.x, this.scene.activeTurret.y-this.y) < (this.hitRadius + this.scene.activeTurret.radius)) {
            this.scene.sound.play("crit", {volume:0.15});
            this.scene.activeTurret.takeDamage(1337);
            this.scene.addTextEffect(new TextEffect(this.scene, this.scene.activeTurret.x-30+(Math.random()*60), this.scene.activeTurret.y-50+(Math.random()*100), Math.round(1337)+" !", "aqua", 75, true, "fuchsia"));
            this.hasCollided = 500;
        }
    }

    die(){
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }


}