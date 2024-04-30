import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { Turret } from "./Turret";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";


export class CollideEnemy extends Enemy{
    public dmg: number = 500;
    public vectorA: number = 0;
    public aimPt: number[] = [0,0];
    constructor(scene: GameScene, x: number, y: number, type: number = 0, dmg: number = 500, useRandom: boolean = false, vnew: number[] = [0,0], anew: number[] = [0,0], aimpoint: number[] = [0,0]) {
        super(scene,x,y,type);
        this.dmg = dmg;
        if(useRandom) {
            this.recalcMovementParams(vnew, anew, aimpoint);
        }
    }

    update(d: number, t: number) {
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }
        this.updateAngle();
        this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        this.collideWithTurret(this.scene.activeTurret);
        this.recalcAccel();
    }

    updateBounds(){
        if ((this.x > 2480)){
            this.despawn();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.despawn();
        } else if ((this.x < -300)) {
            //this.scene.sound.play("escape"); 
            this.despawn();
        }
    }

    protected updateAngle(){
        if(this.myInfo.faceAngle) {
            let a = Math.atan2(this.velocity[1],this.velocity[0])*(180/Math.PI);
            this.mySprite.setAngle(a);
            if((a > 90) || (a < 270)) {
                this.mySprite.setScale(1, -1);
            } else {
                this.mySprite.setScale(1, 1);
            }
        }
    }

    recalcAccel(){
        if(this.x < this.scene.activeTurret.x) {
            return;
        }
        let angle = Math.atan2((this.scene.activeTurret.y-this.y), (this.scene.activeTurret.x-this.x));
        //console.log("ANGLE: " + angle + " AMOUNT: " + this.vectorA);
        this.myInfo.ax = Math.cos(angle)*this.vectorA;
        this.myInfo.ay = Math.sin(angle)*this.vectorA;
    }

    recalcMovementParams(vdata: number[], adata: number[], ptData: number[]){
        this.myInfo.vx = Math.cos(vdata[1]) * vdata[0];
        this.myInfo.vy = Math.sin(vdata[1]) * vdata[0];
        this.myInfo.ax = Math.cos(adata[1]) * adata[0]*0;
        this.myInfo.ay = Math.sin(adata[1]) * adata[0]*0;
        //console.log("ACCEL INFO: " + adata);
        this.vectorA = adata[0];
        this.velocity[0] = this.myInfo.vx;
        this.velocity[1] = this.myInfo.vy;
        this.aimPt = ptData;
    }

    collideWithTurret(t: Turret){
        if((Math.hypot(this.x-t.x, this.y-t.y) < (this.myInfo.radius+t.radius))){
            this.crash(t);
        }
    }

    crash(t: Turret){
        this.scene.sound.play(this.deadSound);
        this.scene.sound.play("crit");
        t.takeDamage(this.dmg);
        this.scene.addTextEffect(new TextEffect(this.scene, t.x-30+(Math.random()*60), t.y-50+(Math.random()*100), Math.round(this.dmg)+" !", "aqua", 75, true, "fuchsia"));
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }
}