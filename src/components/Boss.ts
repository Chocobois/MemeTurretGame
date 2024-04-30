import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
import { BossCommand, BossAction } from "./BossCommand";
import { Mandala } from "./Mandala";

export class Boss extends Enemy {
    public script: BossCommand[];
    public scriptList: BossCommand[][];
    public spin: number = 0;
    public curSpinAngle: number = 0;
    private stopSpin: boolean = false;
    public currentScript: number = 2;
    public prorateDamage: number = 0;
    public prorateTimer: number = 1000;
    public prorating: boolean = false;
    public myMandala: Mandala[];
    
    constructor(scene: GameScene, x: number, y: number, type: number = 0) {
        super(scene, x, y, type);
        this.myMandala = [];
        this.scriptList = [[
            new BossCommand(this, [
                {key: "wait", value: [5000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "spawn", value: [1,9], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "aimedCollidersSpread", value: [1,250,100,-40,40,-1000,1400], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "aimedCollidersSpread", value: [2,250,100,-40,40,-1000,1400], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "aimedCollidersSpread", value: [2,250,100,-40,40,-1000,1400], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [11500], args: [], conditions: []},
                {key: "wait", value: [2550], args: [], conditions: []},
                {key: "spawn", value: [1,10], args: [], conditions: []},
                {key: "wait", value: [3050], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "wait", value: [25000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "aimedCollidersSpread", value: [1,250,100,-10,10,-1000,1400], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1250], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "shield", value: [-260, 0], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1350], args: [], conditions: []},
                {key: "bombardTop", value: [1,1], args: [], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "bombardTop", value: [2,1], args: [], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "bombardTop", value: [1,1], args: [], conditions: []},
                {key: "wait", value: [150], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
        ],
        [

            /*RAY COMMANDS: 0:x 1:y 2:angle 3:dmg s0:lasertex s1:pointtex 4:radialwidth 5:pointradius
        6:rotation 7:laserscale 8:pointscale 9:idletime 10:chargetime 11:ontime 12:fadetime
        13:critchance chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250*/
            //Mandala commands: s0:texture, 0:maxscale, 1:rotation, 2:expansiontime, 3:alpha, b0:playsound, s1:soundfile
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                //{key: "randomwalk_enemy", value: [2], args: [], conditions: []},
                {key: "wait", value: [3750], args: [], conditions: []},
                //{key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "mandala", value: [2, 180, 1000, 0.75], args: ["mandala_brasil","charge_big"], conditions: [true]},
                {key: "wait", value: [5750], args: [], conditions: []},
                {key: "fadeMandala", value: [2000], args: [], conditions: []},
                {key: "wait", value: [5750], args: [], conditions: []},
                {key: "mandala", value: [2, -180, 1000, 0.75], args: ["mandala_brasil","charge_big"], conditions: [true]},

            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "changeSprite", value: [1,1], args: ["finalboss_2"], conditions: []},

            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "laser", value: [0,0,180,450,36,72,0,1,1,1000,500,3000,500,1], args: ["yellow_laser","yellow_laser_origin"], conditions: []},
                {key: "wait", value: [10000], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [500], args: [], conditions: []},
                //{key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [1500], args: [], conditions: []},
                //{key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
        ],
        ];
        this.script = this.scriptList[this.currentScript];
        this.curSpinAngle = this.angle;
        this.setDepth(2);
    }

    update(d: number, t: number) {
        super.update(d,t);
        this.mySprite.setDepth(1);
        this.processScript(d, t);
        this.processRotation(d, t);
        if(this.myMandala.length > 0) {
            this.myMandala[0].update(d,t);
            if(this.myMandala[0].deleteFlag) {
                this.myMandala[0].destroy();
                this.myMandala.splice(0,1);
            }
        }
    }

    processRotation(d: number, t: number){
        if(this.spin != 0) {
            this.curSpinAngle += (this.spin*d/1000);
            if(this.curSpinAngle > 360) {
                this.curSpinAngle -= 360;
                if(this.stopSpin) {
                    this.curSpinAngle = 0;
                    this.spin = 0;
                    this.stopSpin = false;
                }
            } else if (this.curSpinAngle < -360) {
                this.curSpinAngle += 360;
                if(this.stopSpin) {
                    this.curSpinAngle = 0;
                    this.spin = 0;
                    this.stopSpin = false;
                }
            }
            this.setAngle(this.curSpinAngle);
        }
    }

    takeDamage(dmg: number): boolean{
        if(this.prorating) {
            return false;
        }
        if(this.deleteFlag || this.noHitCheck) {
            return false;
        }
        this.health -= dmg;

        if(this.health <= 0) {
            this.die();
        }
        return true;
    }

    takePierceDamage(dmg: number, pID: number, pierceCD: number): boolean {
        if(this.prorating) {
            return false;
        }
        if(this.deleteFlag || this.noHitCheck){
            return false;
        }
        if(!this.projectileTracker.has(pID)){
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else if(this.projectileTracker.get(pID)! == 0) {
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else {
            //this.health -= dmg;
            if(this.health <= 0) {
                this.die();
            }
            return false;
        }

    }

    processScript(d: number, t: number){
        for(let l = 0; l < this.script.length; l++) {
            this.script[l].update(d,t);
        }
    }
    
    advanceActions() {
        if(this.currentScript < (this.scriptList.length-1)) {
            this.currentScript++;
            this.script = this.scriptList[this.currentScript];
        }
    }

    changeSprite(spr:string, frames: number, frameLen: number){
        let st = this.scene.add.sprite(0, 0, spr);
        if(frames <= 1) {
            this.myInfo.anim = false;
        } else {
            this.myInfo.frameData = [frames, frameLen];
            this.setCurFrame(0);
            this.setAnimTimer(frameLen);
        }
        st.setAngle(this.mySprite.angle);
        this.mySprite.setVisible(false);
        this.mySprite.destroy();
        this.mySprite = st;
        this.mySprite.setOrigin(0.5,0.5);
        this.mySprite.setDepth(1);
        this.add(this.mySprite);
    }

    unSpin(){
        this.stopSpin = true;
    }

    fadeMandala(n: number){
        if(this.myMandala.length >= 1) {
            this.myMandala[0].setFade(n);
        }
    }

    addMandala(m: Mandala) {
        this.myMandala.push(m);
    }

    hasMandala() {
        if(this.myMandala.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}