import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { BasicEffect } from "./BasicEffect";
import { TurretParams } from "./PowerUpHandler";
import { TextEffect } from "./TextEffect";
import { Turret } from "./Turret";

export interface EnemyBulletParam{
    velocity: number;
    explode: boolean;
    damage: number;
    sprite: string;
    duration: number;
    radius: number;
    critChance: number;
    critDmg: number;
}

export class EnemyProjectile extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public mySprite: Phaser.GameObjects.Image;
    public velocity: number[] = [0,0];
    public deleteFlag: boolean = false;
    public projectileID: number;
    public gravity: boolean = false;
    public radius: number =  10;
    public duration: number = 10000;
    public angle: number;
    public info: EnemyBulletParam;
    public didCrit: boolean = false;
    public myDmg: number = 0;

    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam) {
		super(scene, x, y);
        this.scene = scene;
        this.angle = angle;
        this.info = info;
        this.velocity = [this.info.velocity*(Math.cos(this.angle)), this.info.velocity*(Math.sin(this.angle))];
        this.x = x;
        this.y = y;
		this.mySprite = this.scene.add.image(0, 0, this.info.sprite);
		this.mySprite.setOrigin(0.5, 0.5);
        this.mySprite.setAngle((180/Math.PI)*this.angle);
        this.add(this.mySprite);
		scene.add.existing(this);
        this.duration = this.info.duration;
	}

    update(d: number){
        this.x += (d*this.velocity[0]/1000);
        this.y += (d*this.velocity[1]/1000);
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

    hitCheck(target: Turret): boolean {

        return (Math.hypot(this.x-target.x, this.y-target.y) < (this.info.radius+target.radius));

    }

    handleCollisionEffects(){
        if(this.myDmg < 1) {
            return;
        }
        if(this.info.explode) {
            this.scene.sound.play("meme_explosion_sound");
            this.scene.addHitEffect(new BasicEffect(this.scene, "meme_explosion", this.x, this.y, 18, 50, false, 0, Math.random()*360, 1));
        } else {
            this.scene.addHitEffect(new BasicEffect(this.scene, "hit_spark", this.x, this.y, 3, 50, false, 0, Math.random()*360, 1));
        }

        if(this.didCrit) {
            this.scene.sound.play("crit");
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.myDmg)+" !", "aqua", 75, true, "fuchsia"));
        } else {
            this.scene.sound.play("turret_hit");
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.myDmg)+"", "red", 60));
        }
    }

    collide(target: Turret){
        if(this.hitCheck(target) && (!this.deleteFlag)) {
            let n = 0;
            n = this.calculateCrit(this.info.damage);
            target.takeDamage(n);
            this.myDmg += n;
            this.die();
        }
    }

    calculateCrit(dmg: number): number{
        if((Math.random() < this.info.critChance)) {
            this.didCrit = true;
            return this.info.critDmg*dmg;
        }
        return dmg;
    }

    die(){
        this.deleteFlag = true;
        this.mySprite.setVisible(false);
    }

}
