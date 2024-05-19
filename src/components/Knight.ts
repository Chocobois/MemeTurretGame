import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { TextEffect } from "./TextEffect";
import { Turret } from "./Turret";

export class Knight extends Enemy {
    private spTime: number = 1000;
    private wt: number[] = [2000,2000];
    private mt: number[] = [0,500];
    private ttx: number[] = [0,1,150];
    private xv: number = -600;
    private dir: number = 1;
    private hasHit: number = 0;
    constructor(scene:GameScene,x:number,y:number,type:number,dir:number){
        super(scene,x,y,type);
        this.dir=dir;
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

    updateBounds(){
        if ((this.x > 2480)){
            this.despawn();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.despawn();
        } else if ((this.x < -300)) {
            this.despawn();
        }
    }

    updateMovement(d: number, t: number): void {
        if(this.spTime > 0) {
            this.spTime -= d;
            this.y += 200*this.dir*(d/1000);
        } else {
            if(this.wt[0] > 0) {
                this.wt[0] -= d;
                if(this.wt[0] <= 0) {
                    this.mt[0] = this.mt[1];
                    this.ttx[1] = 1;
                    this.ttx[0] = this.ttx[2];
                    this.mySprite.setFrame(1);
                    this.scene.sound.play("walk", {volume: 0.5});
                }
            }
            if(this.mt[0] > 0) {
                this.mt[0] -= d;
                this.x += this.xv*d/1000; 
                if(this.ttx[0] > 0) {
                    this.ttx[0] -= d;
                    if(this.ttx[0] <= 0) {
                        if(this.ttx[1] == 1) {
                            this.mySprite.setFrame(0);
                            this.ttx[1] = 0;
                        } else {
                            this.mySprite.setFrame(1);
                            this.ttx[1] = 1;
                        }
                        this.ttx[0] = this.ttx[3];
                    }
                }
                if(this.mt[0] <= 0) {
                    this.wt[0] = this.wt[1];
                    this.ttx[0] = 0;
                    this.ttx[1] = 0;
                }
            }
            if(this.hasHit > 0) {
                this.hasHit -= d;
            }
            if(this.hasHit <= 0) {
                if(this.collisionCheck()){
                    this.scene.sound.play("crit", {volume:0.15});
                    this.scene.activeTurret.takeDamage(1337);
                    this.scene.addTextEffect(new TextEffect(this.scene, this.scene.activeTurret.x-30+(Math.random()*60), this.scene.activeTurret.y-50+(Math.random()*100), Math.round(1337)+" !", "aqua", 75, true, "fuchsia"));
                    this.hasHit=1000;
                }
            }
        }
        
        
    }
    checkBCardinal(t: Turret): boolean {
        let pd = [Math.abs(t.x-this.x), Math.abs(t.y-this.y)];
        if((pd[0] < (t.radius+this.myInfo.boxParams[0]/2)) && (pd[1] < (t.radius+this.myInfo.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }
    collisionCheck(): boolean{
        return(this.checkBCardinal(this.scene.activeTurret));
    }

    updateAnims(d: number): void {
        
    }
}