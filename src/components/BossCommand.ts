import { Boss } from "./Boss"
import { CollideEnemy } from "./CollideEnemy";
import { DiceEnemy } from "./DiceEnemy";
import { DeflectionShield } from "./DeflectionShield";
import { BallisticMissile } from "./BallisticMissile";
import { CircleEffect } from "./CircleEffect";
import { Mine } from "./Mine";
import { RandomWalkEnemy } from "./RandomWalkEnemy";
import { EnemyProjectile } from "./EnemyProjectile";
import { EnemyRay } from "./EnemyRay";
import { Mandala } from "./Mandala";

export interface BossAction{
    key: string;
    value: number[];
    args: string[];
    conditions: boolean[];
}

export class BossCommand
{
    public owner: Boss;
    private pend: boolean = false;
    private timer: number = 0;

    private hpThreshold: number = 0;
    private waitForHP: number = 0;
    private isLooping: number = 0;
    public deleteFlag: boolean = false;
    public step: number = 0;

    public cmd: BossAction[];

    constructor(b: Boss, c: BossAction[]){
        this.owner = b;
        this.cmd = c;
    }

    update(d: number, t: number) {
        this.parseCommand(d,t);
    }

    advance() {
        this.step++;
        if(this.step >= this.cmd.length) {
            this.step = this.cmd.length-1;
            this.pend = true;
        }
    }

    parseCommand(d: number, t: number){
        switch(this.cmd[this.step].key){
            case "wait": {
                if(this.timer > 0 && this.pend) {
                    this.timer -= d;
                    if(this.timer <= 0) {
                        this.timer = 0;
                        this.pend = false;
                        this.advance();
                    }
                } else if (this.timer <= 0 && !this.pend) {
                    this.timer = this.cmd[this.step].value[0];
                    this.pend = true;
                }
                break;
            } case "spawn": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addEnemies(this.cmd[this.step].value[0],this.cmd[this.step].value[1]);
                this.advance();
                break;
            } case "randomwalk_enemy": {
                if(this.pend) {
                    break;
                }
                let xr = 2220;
                let yr = 0;
                for(let re = 0; re < this.cmd[this.step].value[0]; re++) {
                    yr = 200+(Math.random()*680);
                    this.owner.scene.pushEnemy(new RandomWalkEnemy(this.owner.scene,xr,yr,14));
                }

                this.advance();
                break;
            } case "aimedCollidersSpread": {
                if(this.pend) {
                    break;
                }
                //[amount, offset x, offset y, lower angle bound, upper angle bound, velocity, acceleration]
                let acs_aim = [this.owner.scene.activeTurret.x-this.cmd[this.step].value[1]+(2*Math.random()*this.cmd[this.step].value[0]), 
                this.owner.scene.activeTurret.y-this.cmd[this.step].value[2]+(2*Math.random()*this.cmd[this.step].value[0])];
                let aimangle = Math.atan2((acs_aim[1]-this.owner.y),(acs_aim[0]-this.owner.x));;
                let angoffset = 0;
                for (let acs = 0; acs < this.cmd[this.step].value[0]; acs++) {
                    angoffset = (this.cmd[this.step].value[3] + (Math.random()*(this.cmd[this.step].value[4]-this.cmd[this.step].value[3])))*(Math.PI/180);
                    this.owner.scene.pushEnemy(new CollideEnemy(this.owner.scene, this.owner.x, this.owner.y, 8, 350, true, 
                        [this.cmd[this.step].value[5], (aimangle-angoffset)], [this.cmd[this.step].value[6],(aimangle)], acs_aim));
                }
                this.advance();
                break;
            } case "shield": {
                if(this.pend) {
                    break;
                }
                if(!this.owner.hasShield && (this.owner.shieldCooldown <= 0)) {
                    this.owner.scene.pushEnemy(new DeflectionShield(this.owner.scene, 0,0,this.owner,[this.cmd[this.step].value[0],this.cmd[this.step].value[1]],12,1));
                }

                this.advance();
                break;
            } case "bombardTop": {
                if(this.pend) {
                    break;
                }
                let bbb = false;
                if(this.cmd[this.step].value[1] < 1) {
                    bbb = false;
                } else {
                    bbb = true;
                }
                for(let bt = 0; bt < this.cmd[this.step].value[0]; bt++){
                    this.owner.scene.pushEnemy(new BallisticMissile(this.owner.scene, 200+(Math.random()*920), -100, 11, 2000, 600, "meme_explosion", [18,50], "big_explosion", bbb));
                }
                this.advance();
                break;
            }   case "random_mines": {
                if(this.pend) {
                    break;
                }
                let minepos = [0,0]; 
                for(let bt = 0; bt < this.cmd[this.step].value[0]; bt++){
                    minepos = this.getXYinBounds(250,1100,200,700,0);
                    this.owner.scene.pushEnemy(new Mine(this.owner.scene,minepos[0],minepos[1],13,500,600));
                }
                this.advance();
                break;
            }   case "dice": {
                if(this.pend) {
                    break;
                }
                this.spawnDice(this.cmd[this.step].value[0]);
                this.advance();
                break;
            } case "loop": {
                if(this.pend) {
                    break;
                }
                this.step = this.cmd[this.step].value[0];
                break;
            } case "spin": {
                if(this.pend) {
                    break;
                }
                this.owner.spin = this.cmd[this.step].value[0];
                this.advance();
                break;
            } case "circle_effect": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addHitEffect(new CircleEffect(this.owner.scene,this.cmd[this.step].value[0], this.cmd[this.step].value[1], this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3], this.cmd[this.step].value[4],this.cmd[this.step].value[5], this.cmd[this.step].value[6]));
                this.advance();
                break;
            } case "shootCircle": {
                if(this.pend) {
                    break;
                }
                this.shootCircle(this.cmd[this.step].value[0],this.cmd[this.step].value[1],this.cmd[this.step].value[2],
                    [this.cmd[this.step].value[3],this.cmd[this.step].value[4]], this.cmd[this.step].conditions[0]);
                this.advance();
                break;
            } case "laser": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addEnemyRay(new EnemyRay(this.owner.scene, this.owner.x+this.cmd[this.step].value[0],this.owner.y+this.cmd[this.step].value[1],this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3],this.cmd[this.step].args[0],this.cmd[this.step].args[1],this.cmd[this.step].value[4], this.cmd[this.step].value[5],
                    this.cmd[this.step].value[6],this.cmd[this.step].value[7],this.cmd[this.step].value[8],this.cmd[this.step].value[9],this.cmd[this.step].value[10],
                    this.cmd[this.step].value[11],this.cmd[this.step].value[12],this.cmd[this.step].value[13]));
                this.advance();
                break;
            } case "HPChange": {
                if(this.pend) {
                    break;
                }
                this.owner.maxHealth = this.cmd[this.step].value[0];
                this.owner.health = this.owner.maxHealth;
                this.advance();
                break;
            } case "sound": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.sound.play(this.cmd[this.step].args[0]);
                this.advance();
                break;
            } case "mandala": {
                if(this.pend) {
                    break;
                }
                if(!(this.owner.hasMandala())){
                    this.owner.addMandala(new Mandala(this.owner.scene, this.owner.x, this.owner.y, this.owner, this.cmd[this.step].args[0],
                        this.cmd[this.step].value[0],this.cmd[this.step].value[1],this.cmd[this.step].value[2],this.cmd[this.step].value[3],
                        this.cmd[this.step].conditions[0],this.cmd[this.step].args[1]));
                }
                this.advance();
                break;
            } case "fadeMandala": {
                if(this.pend) {
                    break;
                }
                if((this.owner.hasMandala())){
                    this.owner.fadeMandala(this.cmd[this.step].value[0]);
                }
                this.advance();
                break;
            } case "HPThreshold": {
                if(this.pend) {
                    break;
                }
                if((this.owner.health/this.owner.maxHealth) < (this.cmd[this.step].value[0])) {
                    this.advance();
                }
                break;
            } case "changeSprite": {
                if(this.pend) {
                    break;
                }
                this.owner.changeSprite(this.cmd[this.step].args[0], this.cmd[this.step].value[0], this.cmd[this.step].value[1]);
                this.advance();
                break;
            }
        }
    }

    shootCircle(amt: number, type: number, startAngle: number = 0, offset: number[] = [0,0], randomOffset: boolean = false, randomAngle: boolean = false){
        let myAngle = startAngle;
        let cx = 0;
        let cy = 0;
        if(randomAngle) {
            myAngle = Math.random()*(360/amt);
        }
        if(randomOffset){
            cx = this.owner.x - offset[0] + 2*offset[0];
            cy = this.owner.y - offset[1] + 2*offset[1];
        } else {
            cx = this.owner.x + offset[0];
            cy = this.owner.y + offset[1];
        }
        for(let st = 0; st < amt; st++) {
            this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, cx, cy, myAngle, this.owner.getBulletType(type)));
            myAngle += (360/amt);
            if(myAngle > 360) {
                myAngle -= 360;
            } else if (myAngle < -360) {
                myAngle += 360;
            }
        }
    }

    shootCircleAbs(amt: number, type: number, startAngle: number = 0, position: number[] = [0,0], offset: number[] = [0,0], randomOffset: boolean = false){
        let myAngle = startAngle;
        let cx = 0;
        let cy = 0;
        if(randomOffset){
            cx = position[0] - offset[0] + 2*offset[0];
            cy = position[1] - offset[1] + 2*offset[1];
        } else {
            cx = position[0] + offset[0];
            cy = position[1] + offset[1];
        }
        for(let st = 0; st < amt; st++) {
            this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, cx, cy, myAngle, this.owner.getBulletType(type)));
            myAngle += (360/amt);
            if(myAngle > 360) {
                myAngle -= 360;
            } else if (myAngle < -360) {
                myAngle += 360;
            }
        }
    }

    getXYinBounds(xmin: number, xmax: number, ymin: number, ymax: number, iteration: number): number[]{
        let nx = [xmin+(Math.random()*(xmax-xmin)), ymin + (Math.random()*(ymax-ymin))];
        if(iteration > 10) {
            return [xmin+1, ymin+1];
        }
        if(Math.hypot(this.owner.scene.activeTurret.x-nx[0], this.owner.scene.activeTurret.y-nx[1]) < (85+this.owner.scene.activeTurret.radius+60)) {
            return this.getXYinBounds(xmin,xmax,ymin,ymax, (iteration+1));
        } else {
            return nx;
        }
    }

    spawnDice(n: number){
        for(let i = 0; i < n; i++) {
            this.owner.scene.pushEnemy(new DiceEnemy(this.owner.scene,200+(1520*Math.random()),180+(720*Math.random()),7));
        }
    }
}