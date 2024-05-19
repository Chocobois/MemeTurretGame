import { EnemyProjectile } from "./EnemyProjectile";
import { GameScene } from "@/scenes/GameScene";
import { EnemyBulletParam } from "./EnemyProjectile";

export class ExpandingProjectile extends EnemyProjectile{
    private txTimer: number[] = [500,500];
    public bxType: number = 0;
    private i2: EnemyBulletParam;
    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, shouldPierce: boolean = false, collider = false, info2: EnemyBulletParam) {
        super(scene,x,y,angle,info,shouldPierce,collider);
        this.i2=info2;
    }

    update(d: number) {
        super.update(d);
        if(this.txTimer[0] > 0) {
            this.txTimer[0] -= d;
            if(this.txTimer[0] < 0) {
                this.fireSpread();
                this.txTimer[0] = this.txTimer[1];
            }
        }
    }

    fireSpread(){
        let adp = Math.atan2(this.velocity[1],this.velocity[0]);
        let rd = this.cloneEnemyBulletParams(this.i2);
        rd.velocity = 300;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp+Math.PI/2,rd,false,true));
        rd = this.cloneEnemyBulletParams(this.i2);
        rd.velocity = 450;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp+Math.PI/2,rd,false,true));
        rd.velocity = 600;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp+Math.PI/2,rd,false,true));
        rd = this.cloneEnemyBulletParams(this.i2);
        rd.velocity = 300;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp-Math.PI/2,rd,false,true));
        rd = this.cloneEnemyBulletParams(this.i2);
        rd.velocity = 450;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp-Math.PI/2,rd,false,true));
        rd.velocity = 600;
        rd.spinSpeed = -180+Math.random()*360;
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,adp-Math.PI/2,rd,false,true));
    }

    cloneEnemyBulletParams(e: EnemyBulletParam): EnemyBulletParam{
        console.log("DEBUG: " + e);
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