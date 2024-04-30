import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { CircleEffect } from "./CircleEffect";
export class Mine extends Enemy{

    public eTimer: number = 6500;
    public sTimer: number = 3000;
    private vuln: number = 3000;
    private arm: number = 1500;
    private vulnerable: boolean = true;
    private rAngle: number = 0;
    private initTimer: number = 500;
    private initiated: boolean = false;
    public indicator: Phaser.GameObjects.Image;
    public dmg: number = 0;
    public explRadius: number = 0;
    public iAngle: number = 0;
    constructor(scene:GameScene,x:number,y:number,type:number=13,dmg: number = 2000, explRadius: number = 600) {
        super(scene,x,y,type);
        this.dmg = dmg;
        this.explRadius = explRadius;
        this.mySprite.setFrame(0);
        this.indicator = scene.add.image(0,0,"reticle");
        this.indicator.setOrigin(0.5,0.5);
        this.add(this.indicator);
        this.mySprite.setAngle(Math.random()*360);
        this.scene.addHitEffect(new CircleEffect(this.scene,this.x,this.y,500,320,0xFFFFFF,30,0.75));
        this.mySprite.setVisible(false);
        this.indicator.setVisible(false);
        this.indicator.setAlpha(0.5);
        let r = Math.random();
        if(r > 0.5) {
            this.vulnerable = false;
            this.sTimer = this.arm;
            this.mySprite.setFrame(1);
        } else {
            this.vulnerable = true;
            this.sTimer = this.vuln;
            this.mySprite.setFrame(0);
        }
        this.noHitCheck = true;
    }

    updateSpawnCheck(){
        return;
    }

    update(d: number, t: number){
        super.update(d,t);
        if((this.initTimer > 0) && !this.initiated) {
            this.initTimer -=d;
            if(this.initTimer <= 0) {
                this.mySprite.setVisible(true);
                this.indicator.setVisible(true);
                this.noHitCheck = false;
                this.initiated = true;
            }
        } else if (this.initiated) {
            this.processTimer(d,t);
        }


        
    }

    processTimer(d: number, t: number){
        if(this.sTimer > 0) {
            this.sTimer -=d;
            if(this.sTimer <= 0) {
                if(this.vulnerable) {
                    this.vulnerable = false;
                    this.sTimer = this.arm;
                    this.mySprite.setFrame(1);
                } else {
                    this.vulnerable = true;
                    this.sTimer = this.vuln;
                    this.mySprite.setFrame(0);
                }
            }
        }
        if(this.eTimer > 0) {
            this.eTimer -=d;
            if(this.eTimer <= 0) {
                this.eTimer = 0;
                this.indicator.setVisible(false);
                this.boom();
                return;
            } else {
                this.iAngle += (90*d/1000);
                if(this.iAngle > 360) {
                    this.iAngle -= 360;
                }
                this.indicator.setAngle(this.iAngle);
                this.indicator.setScale(this.eTimer/6000);
            }

        }
    }

    die(){
        if(!this.vulnerable) {
            this.boom();
            return;
        }
        this.scene.sound.play(this.deadSound);
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        //this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.maxHealth) +" €", "yellow", 60, true, "white", 800, 100, 0.7, 0));
        this.deleteFlag = true;
    }

    boom() {
        this.scene.sound.play("big_explosion");
        this.scene.activeTurret.takeDamage(this.dmg);
        this.scene.addTextEffect(new TextEffect(this.scene, this.scene.activeTurret.x-30+(Math.random()*60), this.scene.activeTurret.y-50+(Math.random()*100), Math.round(this.dmg)+" !", "aqua", 75, true, "fuchsia"));
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0, 0, Math.round(this.explRadius/50)));
        this.deleteFlag = true;
    }
}