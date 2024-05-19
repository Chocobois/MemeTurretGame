import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { Turret } from "./Turret";
import { TextEffect } from "./TextEffect";
import { BasicEffect } from "./BasicEffect";

export class SnailEnemy extends Enemy{

    public dmg: number = 666;
    public rvel: number = 0;
    public dur: number = 12000;
    constructor(scene:GameScene,x:number,y:number,type:number = 0, v: number = 0, theta: number = 0) {
        super(scene,x,y,type);
        this.myInfo.vx = v*Math.cos(theta*Math.PI/180);
        this.myInfo.vy = v*Math.sin(theta*Math.PI/180);

        this.velocity[0] = this.myInfo.vx;
        this.velocity[1] = this.myInfo.vy;
        this.setAngle(Math.random()*360);
        this.rvel = 120+Math.random()*240;

    }

    update(d: number, t: number){
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        this.updateAngle();
        this.updateSpawnCheck();
        //this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }

        this.setAngle(this.angle + (this.rvel*d/1000));

        if((Math.hypot(this.x-this.scene.activeTurret.x, this.y-this.scene.activeTurret.y) < (this.myInfo.radius+this.scene.activeTurret.radius))){
            this.crash(this.scene.activeTurret);
        }
        if(this.dur > 0) {
            this.dur -= d;
            if(this.dur <= 0) {
                this.die();
            }
        }
    }
    
    crash(t: Turret){
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.sound.play("crit", {volume:0.15});
        t.takeDamage(this.dmg);
        this.scene.addTextEffect(new TextEffect(this.scene, t.x-30+(Math.random()*60), t.y-50+(Math.random()*100), Math.round(this.dmg)+" !", "aqua", 75, true, "fuchsia"));
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }

    protected updateAngle(){
        if(this.myInfo.faceAngle) {
            this.mySprite.setAngle(Math.atan2(this.velocity[1],this.velocity[0])*(180/Math.PI));
        }
    }

    updateSpawnCheck(){
        if(this.noHitCheck && (this.x < (1980+0))){
            this.noHitCheck = false;
        }
    }

    die(){
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }
}