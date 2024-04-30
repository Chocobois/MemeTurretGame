import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";

export class RandomWalkEnemy extends Enemy {

    private randomWalkTimer: number = 1000;
    public rTimer: number = 50;
    public initTimer: number = 1000;
    public initiated: boolean = false;
    constructor(scene: GameScene, x: number, y: number, type: number = 14) {
        super(scene,x,y,type);
        this.initiated = false;
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
        }
    }

    setRandomWalk(){
        let vec = Math.hypot(this.myInfo.vx, this.myInfo.vy);
        let a = Math.random()*2*Math.PI;
        this.velocity = [vec*Math.cos(a), vec*Math.sin(a)];
    }


}