import { GameScene } from "@/scenes/GameScene";
import { EnemyBulletParam, EnemyProjectile } from "./EnemyProjectile";
import { CircleEffect } from "./CircleEffect";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";

export class SplitBullet extends EnemyProjectile {
    public travelTimer: number = 1000;
    public splitTimer: number = 0;
    public maxSplitTimer: number = 500;
    public iterations: number[] = [1,2];
    public paramList: EnemyBulletParam[];
    public splitAmt: number = 2;
    public splitAng: number = 90;
    //public maxIterations: number = 0;

    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, iter: number[], plist: EnemyBulletParam[], amount: number = 2, theta: number = 90, traveltime: number = 750, splitTime: number = 500) {
        super(scene,x,y,angle,info);
        this.paramList = plist;
        this.iterations = iter;
        this.splitAmt = amount;
        if(this.splitAmt < 2) {
            this.splitAmt = 2;
        }
        this.splitAng = theta;
        this.travelTimer = traveltime;
        this.maxSplitTimer = splitTime;
    }

    update(d: number){
        if(this.travelTimer > 0) {
            this.x += (d*this.velocity[0]/1000);
            this.y += (d*this.velocity[1]/1000);
            this.travelTimer -= d;
            if(this.travelTimer <= 0) {
                this.scene.addHitEffect(new CircleEffect(this.scene,this.x,this.y,500,160,0xFFFFFF,30,0.75));
                this.travelTimer = 0;
                this.splitTimer = this.maxSplitTimer;
            }
        }

        if(this.splitTimer > 0) {
            this.splitTimer -= d;
            if(this.splitTimer <= 0) {
                this.split();
            }
        }

        this.duration -= d;
        this.didCrit = false;
        this.myDmg = 0;

        if(this.duration <= 0) {
            this.die();
        }
        if ((this.x > 2480) || (this.x < -300)){
            this.die();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.die();
        }
    }

    split(){
        let nangle = this.splitAng/(this.splitAmt-1);
        let startang = 180-(this.splitAng/2);
        for(let sp = 0; sp < this.splitAmt; sp++){
            if(this.iterations[0] < this.iterations[1]) {
                this.scene.addEnemyProjectile(new SplitBullet(this.scene,this.x,this.y,startang*(Math.PI/180),this.cloneEnemyBulletParams(this.paramList[this.iterations[0]-1]),[this.iterations[0]+1,this.iterations[1]],this.paramList,this.splitAmt,this.splitAng));
            } else {
                this.scene.addEnemyProjectile(new EnemyProjectile(this.scene, this.x,this.y,startang*(Math.PI/180),this.cloneEnemyBulletParams(this.paramList[this.iterations[0]-1])));
            }
            startang+=nangle;
        }
        this.die();
    }

    cloneEnemyBulletParams(e: EnemyBulletParam){
        return {
            velocity: e.velocity,
            explode: e.explode,
            damage: e.damage,
            sprite: e.sprite,
            duration: e.duration,
            radius: e.radius,
            critChance: e.critChance,
            critDmg: e.critDmg,
            useBox: e.useBox, boxParams: e.boxParams,
            spin: e.spin, spinSpeed: e.spinSpeed,
        }
    }
}