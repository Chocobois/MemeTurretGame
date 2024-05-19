import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { Boss } from "./Boss";
import { EnemyBulletParam, EnemyProjectile } from "./EnemyProjectile";
import { ShadowedBullet } from "./ShadowedBullet";
import { BasicEffect } from "./BasicEffect";

export class TwilightBird extends Phaser.GameObjects.Container{
    public owner: Boss;
    public rRad: number = 0;
    public theta: number = 0;
    public radvel: number = 2;
    public spr: Phaser.GameObjects.Sprite
    public scene:GameScene;
    public cooldown: number = 100;
    public bCooldown: number = 2000;
    public deleteFlag: boolean = false;
    public valence: number = 0;
    public isFiring: boolean = false;
    public bullets: EnemyBulletParam[] = [
        { //0 - day feather
            velocity: 1000,
            explode: false,
            damage: 666,
            sprite: "fwhitebig",
            duration: 10000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //1 - night feather
            velocity: 1000,
            explode: false,
            damage: 666,
            sprite: "fblackbig",
            duration: 10000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //2 - day feather slow
            velocity: 500,
            explode: false,
            damage: 666,
            sprite: "fwhitebig",
            duration: 10000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //3 - night feather slow
            velocity: 500,
            explode: false,
            damage: 666,
            sprite: "fblackbig",
            duration: 10000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
    ]

    constructor(scene:GameScene,x:number,y:number,owner:Boss,phase: number = 0){
        super(scene,x,y);
        this.scene=scene;
        this.owner = owner;
        this.rRad = 260;
        this.radvel = 2*Math.PI/3;
        if(phase == 0) {
            this.theta = Math.PI/2;
            this.spr = this.scene.add.sprite(0,0,"daybird");
        } else {
            this.theta = 3*Math.PI/2;
            this.spr = this.scene.add.sprite(0,0,"nightbird");
        }
        this.x = this.owner.x+(Math.cos(this.theta)*this.rRad);
        this.y = this.owner.y+(Math.sin(this.theta)*this.rRad);
        this.valence = phase;
        this.spr.setScale(0.75,0.75);
        this.spr.setOrigin(0.5,0.5);
        this.add(this.spr);
        this.setDepth(3);
        this.scene.add.existing(this);
    }
    
    shootSpread(){
        this.scene.sound.play("fshot");
        let nd = Math.random()*2*Math.PI;
        for(let nr =0;nr<32;nr++){
            this.scene.addEnemyProjectile(new ShadowedBullet(this.scene,this.x,this.y, nd,this.cloneEnemyBulletParams(this.bullets[this.valence+2]), this.valence));
            nd+=(2*Math.PI/32);
            if(nd > (2*Math.PI)) {
                nd -= (2*Math.PI);
            }
        }
    }

    shootLinear(a: number){
        this.scene.sound.play("fshot");
        //let dr = Math.atan2(this.scene.activeTurret.y-this.y, this.scene.activeTurret.x-this.x);
        let vr = (-1*Math.PI/20)+(Math.random()*Math.PI/10);
        a+= vr;
        this.scene.addEnemyProjectile(new ShadowedBullet(this.scene,this.x,this.y, a,this.cloneEnemyBulletParams(this.bullets[this.valence]), this.valence));
    }

    update(d: number, t: number){
        this.theta += this.radvel*(d/1000);
        this.x = this.owner.x+(Math.cos(this.theta)*this.rRad);
        this.y = this.owner.y+(Math.sin(this.theta)*this.rRad);
        const pointer = this.scene.input.activePointer;
        let dr = Math.atan2(pointer.y-this.y, pointer.x-this.x);
        this.setAngle(dr*(180/Math.PI));

        if(this.scene.activeTurret.firing) {
            this.isFiring = true;
        } else {
            this.isFiring = false;
        }

        if(this.bCooldown > 0) {
            this.bCooldown -= d;
            if(this.bCooldown <= 0) {
                this.shootSpread();
                this.bCooldown = 2000;
            }
        }

        if(this.cooldown > 0) {
            this.cooldown -= d;
        }

        if(this.cooldown <= 0){
            if(this.isFiring) {
                this.shootLinear(dr);
                this.cooldown = 100;
            }
        }

        /*
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }*/



        //this.updateMovement(d,t);
        //this.updateAnims(d);
        //this.updateProjectileTracker(d);
        /*

        this.updateAngle();
        this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
        */
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

    erase(){
        this.deleteFlag = true;
        this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
    }
}