import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { FollowCircleEffect } from "./FollowCircleEffect";
import { CircleEffect } from "./CircleEffect";
import { BasicEffect } from "./BasicEffect";

export class RandomWalkEnemy extends Enemy {

    private randomWalkTimer: number = 1000;
    public rTimer: number = 50;
    public initTimer: number = 1000;
    public initiated: boolean = false;
    public tpTime: number[] = [4000,4000];
    public warned: boolean = false;
    public tpPos: number[] = [0,0];
    constructor(scene: GameScene, x: number, y: number, type: number = 14) {
        super(scene,x,y,type);
        this.initiated = false;
        this.tpPos = [660+(Math.random()*600), 290+(Math.random()*500)];
    }

    update(d: number, t: number){
        super.update(d, t);
        if(this.initTimer > 0) {
            this.initTimer -= d;
            if(this.initTimer <= 0) {
                this.initiated = true;
            }
        }

        if(this.initiated) {
            if(this.rTimer > 0) {
                this.rTimer -=d;
                if(this.rTimer <= 0) {
                    if(this.x < 1920) {
                        this.setRandomWalk();
                    }
                    this.rTimer = this.randomWalkTimer;
                }
            }

            if(this.tpTime[0] > 0) {
                this.tpTime[0] -= d;
                if(this.tpTime[0] <= 1000) {
                    if(!this.warned) {
                        this.scene.addHitEffect(new FollowCircleEffect(this.scene,0,0,this,1000,350,0xFFFFFF,20,0.8));
                        this.scene.addHitEffect(new CircleEffect(this.scene,this.tpPos[0],this.tpPos[1],1000,350,0xFFFFFF,20,0.8));
                        this.warned = true;
                    }

                }
                if(this.tpTime[0] <= 0) {
                    this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
                    this.x = this.tpPos[0];
                    this.y = this.tpPos[1];
                    this.tpTime[0] = this.tpTime[1];
                    this.tpPos = [660+(Math.random()*600), 290+(Math.random()*500)];
                    this.warned = false;
                }
            }
        }
    }

    setRandomWalk(){
        let vec = Math.hypot(this.myInfo.vx, this.myInfo.vy);
        let a = Math.random()*2*Math.PI;
        this.velocity = [vec*Math.cos(a), vec*Math.sin(a)];
    }


}