import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
import { BasicEffect } from "./BasicEffect";

export class DiceEnemy extends Enemy{
    public direction: string = "cross";
    private amt: number = 1;
    private initTimer: number = 500;
    private frameTimer: number = 0;
    private spinFrame: number = 6;
    private finishedAnim: boolean = false;
    public tIndicator: Phaser.GameObjects.Image;
    public upMarker: Phaser.GameObjects.Image;
    public downMarker: Phaser.GameObjects.Image;
    public leftMarker: Phaser.GameObjects.Image;
    public rightMarker: Phaser.GameObjects.Image;
    private triggerTimer: number = 750;
    private maxTriggerTimer: number = 750;
    private iAngle: number = 0;
    private indicatorsInitialized: boolean = false;
    private boomScale: number = 1.25;


    constructor(scene: GameScene, x: number, y: number, type: number = 0) {
        super(scene,x,y,type);
        this.scene.sound.play("dice");
        this.setDisplayData();

    }

    setDisplayData(){
        this.amt = 1+(Math.trunc(Math.random()*6));
        let r = Math.trunc(Math.random()*3);
        switch(r) {
            case 0: {
                this.direction = "horizontal";
                break;
            } case 1: { 
                this.direction = "vertical";
                break;
            } case 2: {
                this.direction = "cross";
                break;
            }
        }
        this.tIndicator = this.scene.add.image(0,0,"reticle");
        this.tIndicator.setAlpha(0.75);
        this.tIndicator.setVisible(false);
        this.tIndicator.setOrigin(0.5,0.5);
        this.tIndicator.setScale(this.boomScale, this.boomScale);
        this.add(this.tIndicator);
        this.createIndicators();
        //console.log("INFO: " + this.myInfo);
        //console.log("SPRITE: " + this.myInfo.sprite + "_" + this.direction);
        this.mySprite = this.scene.add.sprite(0, 0, (this.myInfo.sprite + "_" + this.direction));
        this.mySprite.setFrame(6);
        this.mySprite.setScale(0.75*this.boomScale, 0.75*this.boomScale);
        this.mySprite.setOrigin(0.5, 0.5);
        this.hpDisplay = this.scene.add.rectangle(-1*(this.mySprite.width/2), (this.mySprite.height/2), this.mySprite.width, 20, 0x00FF00, 0);
        this.hpDisplay.setVisible(false);
        this.hpDisplay.setOrigin(0,0);
        this.add(this.mySprite);
        this.add(this.hpDisplay);
    }

    createIndicators(){
        this.rightMarker = this.scene.add.image(180*this.boomScale, 0, "marker");
        this.rightMarker.setAlpha(0.8);
        this.rightMarker.setVisible(false);
        this.rightMarker.setOrigin(0.5,0.5);
        this.rightMarker.setScale(this.boomScale, this.boomScale);
        this.downMarker = this.scene.add.image(0, 180*this.boomScale, "marker");
        this.downMarker.setAlpha(0.8);
        this.downMarker.setVisible(false);
        this.downMarker.setOrigin(0.5,0.5);
        this.downMarker.setAngle(90);
        this.downMarker.setScale(this.boomScale, this.boomScale);

        this.leftMarker = this.scene.add.image(-180*this.boomScale, 0, "marker");
        this.leftMarker.setAlpha(0.8);
        this.leftMarker.setVisible(false);
        this.leftMarker.setOrigin(0.5,0.5);
        this.leftMarker.setAngle(180);
        this.leftMarker.setScale(this.boomScale, this.boomScale);
        this.upMarker = this.scene.add.image(0, -180*this.boomScale, "marker");
        this.upMarker.setAlpha(0.8);
        this.upMarker.setVisible(false);          
        this.upMarker.setOrigin(0.5,0.5);
        this.upMarker.setAngle(270);
        this.upMarker.setScale(this.boomScale,this.boomScale);
        this.add(this.rightMarker);
        this.add(this.downMarker);
        this.add(this.leftMarker);
        this.add(this.upMarker);
    }
    
    update(d: number, t: number) {
        super.update(d,t);
        if(this.finishedAnim){
            this.updateDice(d);
        }

    }

    updateDice(d: number){
        if(this.triggerTimer > 0) {
            this.triggerTimer -= d;
            if(this.triggerTimer <= 0) {
                this.updateIndicators(d);
                this.makeExplosions();
                this.triggerTimer = 0;
            } else {
                this.updateIndicators(d);
            }
        }
    }

    
    updateMovement(d: number, t: number){
        return;
    }

    updateIndicators(d: number){
        if(!this.finishedAnim) {
            return;
        }
        if(!this.indicatorsInitialized) {
            this.tIndicator.setVisible(true);
            if((this.direction == "horizontal") || (this.direction == "cross")) {
                this.rightMarker.setVisible(true);
                this.leftMarker.setVisible(true);
            }
            if((this.direction == "vertical") || (this.direction == "cross")){
                this.upMarker.setVisible(true);
                this.downMarker.setVisible(true);
            }
            this.indicatorsInitialized = true;
        }
        this.iAngle += (180*d/1000);
        this.tIndicator.setAngle(this.iAngle);
        this.tIndicator.setScale((this.triggerTimer/this.maxTriggerTimer), (this.triggerTimer/this.maxTriggerTimer));
    }

    makeExplosions() {
        let pri = {
            velocity: 0,
            explode: false,
            damage: 3333,
            sprite: "blank",
            duration: 200,
            radius: 86*this.boomScale,
            critChance: 1,
            critDmg: 3,
        }
        
        if((this.direction == "horizontal") || this.direction == "cross"){
            let hx = 0;
            for(let h = this.amt-1; h > 0; h--) {
                hx = h*this.boomScale*172;
                pri = {
                    velocity: 0,
                    explode: false,
                    damage: 3333,
                    sprite: "blank",
                    duration: 200,
                    radius: 86*this.boomScale,
                    critChance: 1,
                    critDmg: 3,
                }
                this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x+(hx),this.y,0,pri));
                this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x+(hx), this.y-(150*this.boomScale), 6, 60, false, 0, 0, 1*this.boomScale));
                pri = {
                    velocity: 0,
                    explode: false,
                    damage: 3333,
                    sprite: "blank",
                    duration: 200,
                    radius: 86*this.boomScale,
                    critChance: 1,
                    critDmg: 3,
                }
                this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x+(-1*hx), this.y-(150*this.boomScale), 6, 60, false, 0, 0, 1*this.boomScale));
                this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x+(-1*hx),this.y,0,pri));
            }
        }

        if((this.direction == "vertical") || this.direction == "cross"){
            let vy = 0;
            for(let v = this.amt-1; v > 0; v--) {
                vy = v*this.boomScale*172;
                pri = {
                    velocity: 0,
                    explode: false,
                    damage: 3333,
                    sprite: "blank",
                    duration: 200,
                    radius: 86*this.boomScale,
                    critChance: 1,
                    critDmg: 3,
                }
                this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y+(vy),0,pri));
                this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x, this.y+(vy)-(150*this.boomScale), 6, 60, false, 0, 0, 1*this.boomScale));
                pri = {
                    velocity: 0,
                    explode: false,
                    damage: 3333,
                    sprite: "blank",
                    duration: 200,
                    radius: 86*this.boomScale,
                    critChance: 1,
                    critDmg: 3,
                }
                this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x, this.y+(-1*vy)-(150*this.boomScale), 6, 60, false, 0, 0, 1*this.boomScale));
                this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y+(-1*vy),0,pri));
            }
        }
        pri = {
            velocity: 0,
            explode: false,
            damage: 3333,
            sprite: "blank",
            duration: 200,
            radius: 86*this.boomScale,
            critChance: 1,
            critDmg: 3,
        }
        this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,0,pri));
        this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x, this.y-(150*this.boomScale), 6, 60, false, 0, 0, 1*this.boomScale));
        this.scene.sound.play("bigfire");
        this.despawn();

    }

    updateAnims(d: number) {
        if(this.finishedAnim) {
            return;
        }
        if(this.initTimer > 0) {
            this.initTimer-= d;
            this.frameTimer += d;
            if(this.frameTimer >= 50) {
                this.frameTimer = 0;
                this.spinFrame++;
                if(this.spinFrame > 8) {
                    this.spinFrame = 6;
                }
                this.mySprite.setFrame(this.spinFrame);
            }
        } else {
            this.mySprite.setFrame(this.amt-1);
            this.finishedAnim = true;
        }
    }

    die(){
        this.deleteFlag = true;
    }

    updateSpawnCheck(){
        return;
    }
}