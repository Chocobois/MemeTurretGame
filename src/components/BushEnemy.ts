import { CirclingEnemy } from "./CirclingEnemy";
import { GameScene } from "@/scenes/GameScene";
import { EnemyRay } from "./EnemyRay";
import { BasicEffect } from "./BasicEffect";

export class BushEnemy extends CirclingEnemy {
    private phase: number = 0;
    private maxDur: number  = 30000;

    constructor(scene:GameScene, x:number, y:number,type: number=0, center: number[] = [960,540], radialvel: number = 180) {
        super(scene,x,y,type,center,radialvel);
        this.cooldown = 4000;
    }


    update(d: number, t: number){
        this.updateOrbitInit(d);
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        this.updateShootingCycle(d);
        this.updateAngle();
        this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
        if(this.maxDur > 0){
            this.maxDur -= d;
            if(this.maxDur <= 0) {
                this.die();
            }
        }
    }

    updateShootingCycle(d: number){
        if(this.x < 0) {
            return;
        }
        if(this.cooldown > 0) {
            this.cooldown -= d;
            if(this.cooldown <= 0) {
                if(this.phase == 0) {
                    this.scene.sound.play("laser", {volume: 0.25});
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 45 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 135 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 225 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 315 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.phase = 1;
                    this.cooldown = 2500;
                } else if (this.phase == 1) {
                    this.scene.sound.play("laser", {volume: 0.25});
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 0 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 90 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 180 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, 270 ,375,"yellow_laser","yellow_laser_origin",18,36,0,0.5,0.5,500,350,1000,350,1));
                    this.phase = 0;
                    this.cooldown = 2500;
                }
            }
        }
        
    }

    erase(): string{
        console.log("DELETE CALLED ON BUSH");
        this.deleteFlag = true;
        this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
        return "SUCCESS";
    }

    die(){
        this.scene.sound.play(this.deadSound);
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }
}