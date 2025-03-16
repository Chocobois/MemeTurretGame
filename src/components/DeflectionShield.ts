import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
import { BasicEffect } from "./BasicEffect";

export class DeflectionShield extends Enemy{
    public isReflecting: boolean = false;
    public reflectTime: number = 3000;
    public vulnTime: number = 3000;
    public dTimer: number = 0;
    private projInfo: EnemyBulletParam;
    public sOwner: Enemy;
    public sOffset: number[];
    private reflectedThisTick: boolean = false;
    private tEl: number = 0;
    constructor(scene: GameScene, x: number, y: number, parent: Enemy, offset: number[] = [0,0], type: number = 12, bulletType: number = 0) {
        super(scene,x,y,type);
        this.sOwner = parent;
        this.projInfo = this.getBulletType(bulletType);
        this.dTimer = this.vulnTime;
        this.sOffset = offset;
        this.sOwner.hasShield = true;
        
        this.x = this.sOwner.x + this.sOffset[0];
        this.y = this.sOwner.y + this.sOffset[1];
        
        this.mySprite.setFrame(0);
    }

    update(d: number, t: number){
        super.update(d,t);
        this.tEl += d;
        this.x = this.sOwner.x+this.sOffset[0];
        this.y = this.sOwner.y+this.sOffset[1];
        if(this.dTimer > 0) {
            this.dTimer -= d;
            if(this.dTimer <= 0) {
                if(this.isReflecting) {
                    this.isReflecting = false;
                    this.mySprite.setFrame(0);
                    this.dTimer = this.vulnTime;
                } else {
                    this.isReflecting = true;
                    this.mySprite.setFrame(1);
                    this.dTimer = this.reflectTime;
                }
            }
        }
        if(this.reflectedThisTick) {
            this.reflectBullet();
            this.reflectedThisTick = false;
        }
        if(this.tEl > 12500) {
            this.die();
        }
    }

    reflectBullet(){
        let newpos = [this.x, this.y-this.mySprite.height/2+(Math.random()*this.mySprite.height)];
        let bAngl = Math.atan2(this.scene.activeTurret.y-newpos[1], this.scene.activeTurret.x-newpos[0]);
        this.scene.sound.play("reflect");
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene, newpos[0], newpos[1], bAngl, this.cloneEnemyBulletParams(this.projInfo)));
    }

    takeDamage(dmg: number): boolean{
        if(this.isReflecting) {
            this.reflectedThisTick = true;
            return false;
        }
        if(this.deleteFlag || this.noHitCheck) {
            return false;
        }
        this.health -= dmg;

        if(this.health <= 0) {
            this.die();
        }
        return true;
    }

    takePierceDamage(dmg: number, pID: number, pierceCD: number): boolean {
        if(this.isReflecting) {
            this.reflectedThisTick = true;
            return false;
        }
        if(this.deleteFlag || this.noHitCheck){
            return false;
        }
        if(!this.projectileTracker.has(pID)){
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else if(this.projectileTracker.get(pID)! == 0) {
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else {
            //this.health -= dmg;
            if(this.health <= 0) {
                this.die();
            }
            return false;
        }

    }

    die(){
        this.scene.sound.play(this.deadSound);
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.sOwner.hasShield = false;
        this.sOwner.shieldCooldown = 10000;
        this.deleteFlag = true;
    }
}