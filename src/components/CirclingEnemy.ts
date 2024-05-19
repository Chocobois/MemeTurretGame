import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { BasicEffect } from "./BasicEffect";

export class CirclingEnemy extends Enemy{
    public orbitCenter: number[] = [0,0];
    public velTheta: number = 0;
    public timeToRotate: number = 2000;
    public orbitRad: number = 100;
    public rotating: boolean = false;
    protected curAngle: number = 0;
    constructor(scene:GameScene, x:number, y:number,type: number=0, center: number[] = [960,540], radialvel: number = 180){
        super(scene,x,y,type);
        this,this.orbitCenter = center;
        this.velTheta = radialvel;
    }
    
    update(d: number, t: number){
        this.updateOrbitInit(d);
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
    }

    updateOrbitInit(d: number){
        if(this.timeToRotate > 0) {
            this.timeToRotate -= d;
            if(this.timeToRotate <= 0) {
                this.orbitRad = Math.hypot(this.x-this.orbitCenter[0],this.y-this.orbitCenter[1]);
                this.curAngle = Math.atan2(this.y-this.orbitCenter[1], this.x-this.orbitCenter[0])*(180/Math.PI);
                this.rotating = true;
            }
        }
    }

    updateMovement(d: number, t: number){
        if(!this.rotating) {
            this.x += (this.slow*this.velocity[0])*d/1000;
            this.y += (this.slow*this.velocity[1])*d/1000;
            this.velocity[0] += this.myInfo.ax * (d/1000);
            this.velocity[1] += this.myInfo.ay * (d/1000);
            if(this.bounce){
                this.y += this.slow*this.amplitude*4*Math.sin((this.offset+t)/250);
            }
        } else {
            this.curAngle += (this.slow*this.velTheta*(d/1000));
            if(this.bounce) {
                this.orbitRad += (this.slow*this.amplitude*4*Math.sin((this.offset+t)/250));
            }
            this.x = this.orbitCenter[0]+(Math.cos(this.curAngle*(Math.PI/180))*this.orbitRad);
            this.y = this.orbitCenter[1]+(Math.sin(this.curAngle*(Math.PI/180))*this.orbitRad);
        }

        if(this.slowTimer > 0) {
            this.slowTimer -= d;
            if(this.slowTimer <= 0) {
                this.slowTimer = 0;
                this.slow = 1;
            }
        }
        //this.handleReflect();
    }
    erase(): string{
        this.deleteFlag = true;
        this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
        return "SUCCESS";
    }
}