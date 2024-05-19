import { CircleEffect } from "./CircleEffect";
import { Enemy } from "./Enemy";
import { BaseScene } from "@/scenes/BaseScene";

export class FollowCircleEffect extends CircleEffect{
    public owner:Enemy;
    constructor(scene: BaseScene, x: number, y: number, owner:Enemy, time: number, radius: number, color: number = 0xFFFFFF, stroke: number = 20, alpha: number = 0.75) {
        super(scene,x,y,time,radius,color,stroke,alpha);
        this.owner = owner;
    }

    update(d: number, t:number) {
        if(!(this.owner == undefined)) {
            this.x = this.owner.x;
            this.y = this.owner.y;
        }
        super.update(d,t);
    }
}