import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";

export class BallisticMissile extends Enemy{
    public animData: number[];
    public explAnim: string;
    public explRadius: number;
    public explSound: string;
    public dmg: number;
    public shouldTeleport: boolean = false;
    private teleportTimer: number = 1000;
    private tTimer: number = 0;
    private teleportQueued: boolean = false;
    private teleportX: number = 0;
    private tDisplay: Phaser.GameObjects.Graphics;
    constructor(scene: GameScene, x: number, y: number, type: number = 11, dmg: number = 2000,
        explosionRadius: number = 600, anim: string = "meme_explosion", animdata: number[] = [18, 50], sound: string = "big_explosion", tele: boolean = false) {
        super(scene,x,y, type);
        this.animData = animdata;
        this.explAnim = anim;
        this.explRadius = explosionRadius;
        this.explSound = sound;
        this.dmg = dmg;
        this.shouldTeleport = tele;
        this.tTimer = Math.round(200+(Math.random()*1300));
        this.tDisplay = this.scene.add.graphics();
        this.tDisplay.lineStyle(20,0x1E90FF, 0.45);
        this.add(this.tDisplay);
        if(this.shouldTeleport) {
            this.queueTeleport();
        }
    }

    update(d: number, t: number){
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
        if(this.shouldTeleport) {
            if(this.tTimer > 0) {
                this.tTimer -= d;
                if(this.tTimer <= 0) {
                    this.teleport();
                    this.queueTeleport();
                    this.tTimer = this.teleportTimer;
                }
            }
            this.tDisplay.clear();
            if(this.tTimer < 350) {
                this.tDisplay.lineStyle(20,0xDC143C, 0.45);
            } else {
                this.tDisplay.lineStyle(20,0x1E90FF, 0.45);
            }
            if(this.teleportX != 0) {
                this.tDisplay.beginPath();
                this.tDisplay.moveTo(0,0);
                this.tDisplay.lineTo(this.teleportX, 0);
                this.tDisplay.arc(this.teleportX,0,60,0,360,false,0.01);
                this.tDisplay.closePath();
                this.tDisplay.strokePath();
            }
        }
    }

    updateBounds(){
        if ((this.x > 2480) || (this.x < -300)){
            this.despawn();
        } else if ((this.y < -300)){
            this.despawn();
        } else if ((this.y > 1080)) {
            this.boom();
        }
    }

    queueTeleport(){
        let p = 50+Math.random()*350;
        let xi = this.x+p;
        let xn = this.x-p;
        let xnew = 0;
        xnew = p;
        if(this.checkTeleportOOB(xi) || (Math.hypot(this.scene.activeTurret.x-xi, this.scene.activeTurret.y-this.y) < (this.myInfo.radius + this.scene.activeTurret.radius + 50)) ) {
            if(this.checkTeleportOOB(xn) || (Math.hypot(this.scene.activeTurret.x-xn, this.scene.activeTurret.y-this.y) < (this.myInfo.radius + this.scene.activeTurret.radius + 50)) ) {
                this.teleportX = 0;
                return;
            } else {
                xnew = -1*p;
            }
        }

        this.teleportX = xnew;

    }

    teleport(){
                
        this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
        this.x += this.teleportX;
        //this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
    }

    checkTeleportOOB(n: number) {
        if((n < 200) || n > 1120) {
            return true;
        } else {
            return false;
        }
    }

    boom(){
        this.scene.sound.play(this.explSound);
        this.scene.activeTurret.takeDamage(this.dmg);
        this.scene.addTextEffect(new TextEffect(this.scene, this.scene.activeTurret.x-30+(Math.random()*60), this.scene.activeTurret.y-50+(Math.random()*100), Math.round(this.dmg)+" !", "aqua", 75, true, "fuchsia"));
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0, 0, Math.round(this.explRadius/50)));
        this.deleteFlag = true;

    }

    die(){
        this.scene.sound.play(this.deadSound);
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        //this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.maxHealth) +" €", "yellow", 60, true, "white", 800, 100, 0.7, 0));
        this.deleteFlag = true;
    }

}