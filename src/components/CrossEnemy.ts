import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { EnemyRay } from "./EnemyRay";
import { Boss } from "./Boss";
import { CircleEffect } from "./CircleEffect";

export class CrossEnemy extends Enemy {
public initTimer: number = 500;
public duration: number = 15000;
public owner: Boss;
    constructor(scene:GameScene,x:number,y:number,type:number=15, prt: Boss, valence: number = 1) {
        super(scene,x,y,type);
        this.mySprite.setVisible(false);
        this.owner = prt;
        this.scene.addHitEffect(new CircleEffect(this.scene,this.x,this.y,500,320,0xFFFFFF,30,0.75));

        this.myInfo.vy *= valence;
        this.velocity[1] *= valence;

    }

    update(d: number, t: number){
        if(this.initTimer > 0) {
            this.initTimer -=d;
            if(this.initTimer <= 0) {
                this.mySprite.setVisible(true);
            }
            return;
        } else {
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
            if(this.shieldCooldown > 0) {
                this.shieldCooldown -= d;
            }

            if(this.duration > 0) {
                this.duration -= d;
                if(this.duration <= 0) {
                    this.die();
                }
            }
        }
    }

    die(){
        this.scene.sound.play(this.deadSound, {volume: 0.35});
        let a = Math.atan2(this.scene.activeTurret.y-this.y, this.scene.activeTurret.x-this.x)*(180/Math.PI);
        this.scene.sound.play("laser", {volume: 0.25});
        this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, a,375,"brasil_laser","brasil_laser_origin",36,72,0,1,1,1000,500,3000,500,1));
        this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, a-30,375,"brasil_laser","brasil_laser_origin",36,72,0,1,1,1000,500,3000,500,1));
        this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, a+30,375,"brasil_laser","brasil_laser_origin",36,72,0,1,1,1000,500,3000,500,1));

        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.owner.crossAmount -= 1;
        this.deleteFlag = true;
    }


}