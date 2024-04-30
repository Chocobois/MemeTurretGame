import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { Turret } from "./Turret";
import { TextEffect } from "./TextEffect";
import { BasicEffect } from "./BasicEffect";

export class EnemyRay extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public laserOrigin: Phaser.GameObjects.Image;
    public laser: Phaser.GameObjects.Image;
    public deleteFlag: boolean = false;
    public xLen: number = 0;
    public laserScale: number = 1;
    public pointScale: number = 1;
    public maxChargeTime: number = 1000;
    public maxOnTime: number = 1000;
    public maxFadeTime: number = 1000;
    public maxIdleTime: number = 1000;
    public rayID: number = 0;
    public dmg: number = 1000;
    public laserHitbox: number = 10;
    public pointHitbox: number = 10;
    public crit: number = 0;
    private static IDLE: number = 0;
    private static CHARGE: number = 1;
    private static ON: number = 2;
    private static FADE: number = 3;
    private laserState: number = 0;
    private lTimer: number = 1000;
    private maxHitTimer: number = 250;
    private hitTimer: number = 250;
    private noHitCheck: boolean = false;
    private rVel: number = 0;
    private curAngle: number = 0;

    private chargeAlpha: number = 0.6;
    private onAlpha: number = 0.95;
    private fadeAlpha: number = 0.6;

    constructor(scene: GameScene,x:number,y:number,angle:number,dmg:number,lasertex:string,pointtex:string,radialwidth:number,pointradius:number,
        rotation:number=0,laserscale:number, pointscale:number, idletime:number, chargetime:number, ontime:number, fadetime:number, critchance:number = 0,
        chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250) {
        super(scene,x,y);
        this.scene = scene;
        this.laserOrigin = this.scene.add.image(0,0,pointtex);
        this.laser = this.scene.add.image(0,0,lasertex);
        this.xLen = 2240/this.laser.width;
        this.chargeAlpha = chargealpha;
        this.onAlpha = onalpha;
        this.fadeAlpha = fadealpha;
        this.laser.setOrigin(0,0.5);
        this.laserOrigin.setOrigin(0.5,0.5);
        this.laserScale = laserscale;
        if(this.laserScale < 0.055) {
            this.laserScale = 0.055;
        }
        this.pointScale = pointscale;
        this.laser.setScale(this.xLen,0.05);
        this.laserOrigin.setScale(0.05,0.05);
        this.laser.setAlpha(this.chargeAlpha);
        this.laserOrigin.setAlpha(this.chargeAlpha);
        this.add(this.laser);
        this.add(this.laserOrigin);
        this.curAngle = angle;
        this.setAngle(angle);
        this.rayID = this.scene.getProjID();
        this.maxIdleTime = idletime;
        this.maxChargeTime = chargetime;
        this.maxFadeTime = fadetime;
        this.maxOnTime = ontime;
        this.laserHitbox=radialwidth;
        this.pointHitbox=pointradius;
        this.crit=critchance;
        this.lTimer = this.maxIdleTime;
        this.laserState = EnemyRay.IDLE;
        this.rVel = rotation;
        this.maxHitTimer = ticktimer;
        this.dmg=dmg;
        this.scene.add.existing(this);
        this.setDepth(4);
    }

    update(d: number, t: number){
        if(this.rVel != 0) {
            this.curAngle += (this.rVel*d/1000);
            if(this.curAngle > 360) {
                this.curAngle -= 360;
            } else if (this.curAngle < -360) {
                this.curAngle += 360;
            }
            this.setAngle(this.curAngle);
        }
        if(this.lTimer > 0) {
            this.lTimer -= d;
        }
        switch(this.laserState) {
            case EnemyRay.IDLE: {
                if(this.lTimer <= 0) {
                    this.lTimer = this.maxChargeTime;
                    this.laserState = EnemyRay.CHARGE;
                }
                break;
            }
            case EnemyRay.CHARGE: {
                if(this.lTimer <= 0) {
                    this.lTimer = this.maxOnTime;
                    this.laser.setScale(this.xLen, this.laserScale);
                    this.laser.setAlpha(this.onAlpha);
                    this.laserOrigin.setScale(this.pointScale, this.pointScale);
                    this.laserOrigin.setAlpha(this.onAlpha);
                    this.laserState = EnemyRay.ON;
                } else {
                    this.laser.setScale(this.xLen, 0.05+((this.laserScale-0.05)*(1-(this.lTimer/this.maxChargeTime))));
                    let psc = 0.05+((this.pointScale-0.05)*(1-(this.lTimer/this.maxChargeTime)));
                    this.laserOrigin.setScale(psc,psc);
                }
                break;
            } case EnemyRay.ON: {
                if(this.lTimer <= 0) {
                    this.lTimer = this.maxFadeTime;
                    this.laser.setAlpha(this.fadeAlpha);
                    this.laserOrigin.setAlpha(this.fadeAlpha);
                    this.laserState = EnemyRay.FADE;
                } else {
                    if(this.hitTimer > 0) {
                        this.hitTimer -= d;
                    }
                    this.hitCheck(this.scene.activeTurret);
                }
                break;
            } case EnemyRay.FADE: {
                if(this.lTimer <= 0) {
                    this.laser.setVisible(false);
                    this.laserOrigin.setVisible(false);
                    this.deleteFlag = true;
                } else {
                    this.laser.setScale(this.xLen, this.laserScale*(this.lTimer/this.maxFadeTime));
                    let pscf = this.pointScale*(this.lTimer/this.maxFadeTime);
                    this.laserOrigin.setScale(pscf,pscf);
                }
            }
        }
    }
    
    hitCheck(t: Turret){
        if(this.hitTimer > 0) {
            return;
        }

        let a = Math.atan2(t.y-this.y, t.x-this.x);
        let d = Math.hypot(t.x-this.x, t.y-this.y);
        a -= (this.angle*Math.PI/180);
        let ptr = [(d*Math.cos(a)), (d*Math.sin(a))];
        if(this.hitCheckPoint(t) || this.hitcheckRay(t, ptr)) {
            if(this.crit > 0) {
                if(Math.random() < this.crit) {
                    this.scene.sound.play("crit", {volume: 0.2});
                    t.takeDamage(2*this.dmg);
                    this.scene.addTextEffect(new TextEffect(this.scene, t.x-30+(Math.random()*60), t.y-50+(Math.random()*100), Math.round(2*this.dmg)+" !", "aqua", 75, true, "fuchsia"));
                }
            } else {
                this.scene.sound.play("turret_hit", {volume: 0.25});
                t.takeDamage(this.dmg);
                this.scene.addTextEffect(new TextEffect(this.scene, t.x-30+(Math.random()*60), t.y-50+(Math.random()*100), Math.round(this.dmg)+"", "red", 60));
            }
            this.hitTimer = this.maxHitTimer;    
        }
    }

    hitCheckPoint(t: Turret): boolean {
        if((Math.hypot(t.x-this.x, t.y-this.y) < (this.pointHitbox+t.radius))) {
            return true;
        } else {
            return false;
        }
    }

    hitcheckRay(t: Turret, ptr: number[]): boolean{
        if(this.checkY(t,Math.abs(ptr[1])) && this.checkX(t, ptr[0])){
            return true;
        } else {
            return false;
        }
    }

    checkY(t: Turret, n: number) {
        if((n < (t.radius+this.laserHitbox))) {
            return true;
        } else {
            return false;
        }
    }

    checkX(t: Turret, n: number) {
        if((n > 0)) {
            return true;
        } else {
            return false;
        }
    }
    
    initGraphics() {

    }

    collide(){

    }

}