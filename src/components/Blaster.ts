import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { CircleEffect } from "./CircleEffect";
import { Projectile } from "./Projectile";
import { EnemyRay } from "./EnemyRay";

export class Blaster extends Enemy {
    public rTimer: number = 500
    public bTimer: number = 0;
    public fTimer: number = 0;
    public dur: number = 2000;
    private aimH: boolean = false;

    constructor(scene:GameScene,x:number,y:number,type:number = 17, aimH = false) {
        super(scene,x,y,type);
        this.scene.addHitEffect(new CircleEffect(this.scene,this.x,this.y,500,320,0xFFFFFF,30,0.75));
        //this.mySprite.setVisible(false);
        this.mySprite.setAlpha(0);
        this.scene.sound.play("blaster_spawn", {volume: 0.35});
        this.mySprite.setScale(-1,-1);
        this.aimH=aimH;
    }

    update(d: number, t: number){
        if(this.rTimer > 0) {
            this.rTimer -= d;
            if(this.rTimer <= 0) {
                this.bTimer = 500;
            }
        }
        if(this.bTimer > 0) {
            this.bTimer -= d;
            this.setAngle(Math.random()*360);
            if(this.bTimer <= 0) {
                this.mySprite.setAlpha(1);
                //this.mySprite.setVisible(true);
                let aa = Math.atan2(this.scene.activeTurret.y-this.y, this.scene.activeTurret.x-this.x)*(180/Math.PI);
                if(this.aimH) {
                    aa = 180;
                }
                this.setAngle(aa);
                this.scene.addEnemyRay(new EnemyRay(this.scene,this.x,this.y, aa,375,"orange_laser","orange_laser_origin",36,72,0,1,1,350,150,500,350,1));
                this.scene.sound.play("blaster_fire", {volume: 0.35});
                this.fTimer = 1500;
            } else {
                this.mySprite.setAlpha((1-this.bTimer/500));
            } 
        }
        if(this.fTimer > 0) {
            this.fTimer -= d;
            if(this.fTimer <= 0) {
                this.mySprite.setAlpha(0);
                this.die();
            } else {
                this.mySprite.setAlpha((this.fTimer/2000));
            }
        }
        //this.updateMovement(d,t);
        //this.updateAnims(d);
        //this.updateProjectileTracker(d);
        /*
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }*/
        //this.updateAngle();
        //this.updateSpawnCheck();
        //this.updateHealthDisplay(d);
        //this.updateBounds();
        /*
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
        */
    }

    hitCheck(p: Projectile, r: number): boolean{
        return false;
    }

    updateSpawnCheck(){
        return;
    }
    die(){
        //this.scene.sound.play("unf");
        this.deleteFlag = true;
    }
}