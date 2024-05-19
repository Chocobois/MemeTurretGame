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
import { CrossEnemy } from "./CrossEnemy";
import { SplitBullet } from "./SplitBullet";
import { BushEnemy } from "./BushEnemy";
import { TextEffect } from "./TextEffect";
import { Blaster } from "./Blaster";
import { FallingEnemy } from "./FallingEnemy";
import { SnailEnemy } from "./SnailEnemy";
import { ShadowedBullet } from "./ShadowedBullet";
import { FollowCircleEffect } from "./FollowCircleEffect";
import { RotatingPan } from "./RotatingPan";
import { BasicEffect } from "./BasicEffect";
import { ParticleEffect } from "./ParticleEffect";
import { Trojan } from "./Trojan";
import { ExpandingProjectile } from "./ExpandingProjectile";
import { Turret } from "./Turret";
import { Turtle } from "./Turtle";
import { TitleEffect } from "./TitleEffect";

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
    private variableMap: Map<string,number>;

    public cmd: BossAction[];

    constructor(b: Boss, c: BossAction[]){
        this.owner = b;
        this.cmd = c;
        this.variableMap = new Map<string,number>();
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
            }   case "spawn": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addEnemies(this.cmd[this.step].value[0],this.cmd[this.step].value[1]);
                this.advance();
                break;
            }   case "randomwalk_enemy": {
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
            } case "spawnBush": {
                if(this.pend) {
                    break;
                }
                let ry = 0;
                let rv = 120;
                if(Math.random() < 0.5) {
                    ry = 240;
                    rv = -120;
                } else {
                    ry = 840;
                    rv = 120;
                }
                this.owner.scene.pushBush(new BushEnemy(this.owner.scene, 2120, ry, 16, [960,540],rv));
                this.advance();
                break;
            }   case "aimedCollidersSpread": {
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
            }   case "loop": {
                if(this.pend) {
                    break;
                }
                this.step = this.cmd[this.step].value[0];
                break;
            }   case "spin": {
                if(this.pend) {
                    break;
                }
                this.owner.spin = this.cmd[this.step].value[0];
                this.advance();
                break;
            }   case "unspin": {
                if(this.pend) {
                    break;
                }
                this.owner.unSpin();
                this.advance();
                break;
            }   case "circle_effect": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addHitEffect(new CircleEffect(this.owner.scene,this.cmd[this.step].value[0], this.cmd[this.step].value[1], this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3], this.cmd[this.step].value[4],this.cmd[this.step].value[5], this.cmd[this.step].value[6]));
                this.advance();
                break;
            }   case "circle_effect_centered": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addHitEffect(new FollowCircleEffect(this.owner.scene,this.owner.x+this.cmd[this.step].value[0], this.owner.y+this.cmd[this.step].value[1], this.owner, this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3], this.cmd[this.step].value[4],this.cmd[this.step].value[5], this.cmd[this.step].value[6]));
                this.advance();
                break;
            }   case "shootCircle": {
                if(this.pend) {
                    break;
                }
                this.shootCircle(this.cmd[this.step].value[0],this.cmd[this.step].value[1],this.cmd[this.step].value[2],
                    [this.cmd[this.step].value[3],this.cmd[this.step].value[4]], this.cmd[this.step].conditions[0], this.cmd[this.step].conditions[1]);
                this.advance();
                break;
            }   case "teleport": {
                if(this.pend) {
                    break;
                }
                this.owner.x = this.cmd[this.step].value[0];
                this.owner.y = this.cmd[this.step].value[1];
                this.advance();
                break;
            }   case "storeRandomTele": {
                if(this.pend) {
                    break;
                }
                this.variableMap.set(this.cmd[this.step].args[0],200+(Math.random()*1520));
                this.variableMap.set(this.cmd[this.step].args[1],150+(Math.random()*780));
                this.advance();
                break;
            }   case "blink": {
                if(this.pend) {
                    break;
                }
                this.owner.setBlink(this.cmd[this.step].value[0]);
                this.advance();
                break;
            }   case "forceMove": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.activeTurret.fMove = (this.cmd[this.step].value[0]);
                this.advance();
                break;
            }   case "randomExpl": {
                if(this.pend) {
                    break;
                }
                let xr = -0.5*0.75*(this.owner.mySprite.width)+(Math.random()*0.75*this.owner.mySprite.width);
                let yr = -0.5*0.75*(this.owner.mySprite.height)+(Math.random()*0.75*this.owner.mySprite.height);
                this.owner.scene.addHitEffect(new BasicEffect(this.owner.scene, this.cmd[this.step].args[0], this.owner.x+xr, this.owner.y+yr, 
                    this.cmd[this.step].value[0], this.cmd[this.step].value[1], false, 0,360*Math.random(),this.cmd[this.step].value[2]));
                this.advance();
                break;
            }   case "slowExpl": {
                if(this.pend) {
                    break;
                }
                let xr = -0.5*0.25*(this.owner.mySprite.width)+(Math.random()*0.25*this.owner.mySprite.width);
                let yr = -0.5*0.25*(this.owner.mySprite.height)+(Math.random()*0.25*this.owner.mySprite.height);
                this.owner.scene.addHitEffect(new BasicEffect(this.owner.scene, this.cmd[this.step].args[0], this.owner.x+xr, this.owner.y+yr, 
                    this.cmd[this.step].value[0], this.cmd[this.step].value[1], false, 0,360*Math.random(),this.cmd[this.step].value[2]));
                this.advance();
                break;
            }   case "storeTele": {
                if(this.pend) {
                    break;
                }
                this.variableMap.set(this.cmd[this.step].args[0],this.cmd[this.step].value[0]);
                this.variableMap.set(this.cmd[this.step].args[1],this.cmd[this.step].value[1]);
                this.advance();
                break;
            }   case "storeSpinLaser": {
                if(this.pend) {
                    break;
                }
                this.variableMap.set(this.cmd[this.step].args[0],this.cmd[this.step].value[0]);
                this.variableMap.set(this.cmd[this.step].args[1],this.cmd[this.step].value[1]);
                this.advance();
                break;
            }   case "spinLaser": {
                if(this.pend) {
                    break;
                }
                let rs = this.variableMap.get(this.cmd[this.step].args[2])!;
                let rb = this.variableMap.get(this.cmd[this.step].args[3])!;
                let ar = (rs+rb);

                let dx = this.owner.x+(Math.cos(ar*(Math.PI/180))*(this.cmd[this.step].value[0]));
                let dy = this.owner.y+(Math.sin(ar*(Math.PI/180))*(this.cmd[this.step].value[0]));
                //console.log("Laser Angle: " + ar);
                this.owner.scene.addEnemyRay(new EnemyRay(this.owner.scene, dx, dy, ar,
                    this.cmd[this.step].value[3],this.cmd[this.step].args[0],this.cmd[this.step].args[1],this.cmd[this.step].value[4], this.cmd[this.step].value[5],
                    this.cmd[this.step].value[6],this.cmd[this.step].value[7],this.cmd[this.step].value[8],this.cmd[this.step].value[9],this.cmd[this.step].value[10],
                    this.cmd[this.step].value[11],this.cmd[this.step].value[12],this.cmd[this.step].value[13]));
                rs += (this.cmd[this.step].value[1]);
                rb += (this.cmd[this.step].value[2]);
                if(rs > 360) {
                    rs -= 360;
                } else if (rs < -360) {
                    rs += 360;
                }
                if(rb > 360) {
                    rb -= 360;
                } else if (rs < -360) {
                    rb += 360;
                }
                this.variableMap.set(this.cmd[this.step].args[2],rs);
                this.variableMap.set(this.cmd[this.step].args[3],rb);
                this.advance();
                break;
            }   case "warnTele": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addHitEffect(new CircleEffect(this.owner.scene,this.variableMap.get(this.cmd[this.step].args[0])!, this.variableMap.get(this.cmd[this.step].args[1])!, 2000,
                    800, 0xFFFFFF,50, 1));
                this.owner.scene.addHitEffect(new FollowCircleEffect(this.owner.scene,this.owner.x, this.owner.y, this.owner, 2000,
                800, 0xFFFFFF,50, 1));
                this.advance();
                break;
            }   case "getTele": {
                if(this.pend) {
                    break;
                }
                this.owner.x = this.variableMap.get(this.cmd[this.step].args[0])!;
                this.owner.y = this.variableMap.get(this.cmd[this.step].args[1])!;
                this.advance();
                break;
            }   case "spacedFishSplitFromBack": {
                if(this.pend) {
                    break;
                }

                let sft = 1080/this.cmd[this.step].value[0];
                let start = (-25)+(Math.random()*1*sft);
                let r =3;
                for(let sfs = 0; sfs < this.cmd[this.step].value[0]; sfs++) {
                    if(Math.random()<0.5) {
                        r = 3;
                    } else {
                        r = 4;
                    }
                    this.owner.scene.addEnemyProjectile(new SplitBullet(this.owner.scene, 2020, start, 180*(Math.PI/180),this.owner.getBulletType(r),[1,2],
                    [this.owner.getBulletType(r), this.owner.getBulletType(r)], 2, 50, 1200+(Math.random()*800)));
                    start += sft;
                }
                //[]
                //    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, iter: number[], plist: EnemyBulletParam[], amount: number = 2, theta: number = 90, traveltime: number = 1000, splitTime: number = 500) {


                this.advance();
                break;
            }   case "laser": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addEnemyRay(new EnemyRay(this.owner.scene, this.owner.x+this.cmd[this.step].value[0],this.owner.y+this.cmd[this.step].value[1],this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3],this.cmd[this.step].args[0],this.cmd[this.step].args[1],this.cmd[this.step].value[4], this.cmd[this.step].value[5],
                    this.cmd[this.step].value[6],this.cmd[this.step].value[7],this.cmd[this.step].value[8],this.cmd[this.step].value[9],this.cmd[this.step].value[10],
                    this.cmd[this.step].value[11],this.cmd[this.step].value[12],this.cmd[this.step].value[13]));
                this.advance();
                break;
            }   case "backlaser": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addEnemyRay(new EnemyRay(this.owner.scene, this.cmd[this.step].value[0],this.cmd[this.step].value[1]+Math.random()*(1080-2*this.cmd[this.step].value[1]),this.cmd[this.step].value[2],
                    this.cmd[this.step].value[3],this.cmd[this.step].args[0],this.cmd[this.step].args[1],this.cmd[this.step].value[4], this.cmd[this.step].value[5],
                    this.cmd[this.step].value[6],this.cmd[this.step].value[7],this.cmd[this.step].value[8],this.cmd[this.step].value[9],this.cmd[this.step].value[10],
                    this.cmd[this.step].value[11],this.cmd[this.step].value[12],this.cmd[this.step].value[13]));
                this.advance();
                break;
            }   case "spreadPans": {
                if(this.pend) {
                    break;
                }
                let rs = Math.random()*360;
                let ofs = -40+(Math.random()*80);
                this.owner.scene.sound.play("big_gun_1");
                for(let sp = 0; sp < this.cmd[this.step].value[0]; sp++) {
                    this.owner.scene.addEnemyProjectile(new RotatingPan(this.owner.scene, this.owner.x, this.owner.y, rs*(Math.PI/180)
                    ,this.owner.getBulletType(8),ofs*(Math.PI/180),800));
                    rs+=25;
                }
                this.advance();
                break;
            }   case "aimSpreadPans": {
                if(this.pend) {
                    break;
                }
                let rs = Math.atan2(this.owner.scene.activeTurret.y-this.owner.y, this.owner.scene.activeTurret.x-this.owner.x)-(25*(Math.PI/180));
                let ofs = -40+(Math.random()*80);
                this.owner.scene.sound.play("big_gun_1");
                for(let sp = 0; sp < this.cmd[this.step].value[0]; sp++) {
                    this.owner.scene.addEnemyProjectile(new RotatingPan(this.owner.scene, this.owner.x, this.owner.y, rs
                    ,this.owner.getBulletType(8),ofs*(Math.PI/180),800));
                    rs+=25*(Math.PI/180);
                }
                this.advance();
                break;
            }   case "trojan": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushEnemy(new Trojan(this.owner.scene, 2120,200+Math.random()*680,21));
                this.advance();
                break;
            }   case "HPChange": {
                if(this.pend) {
                    break;
                }
                this.owner.maxHealth = this.cmd[this.step].value[0];
                this.owner.health = this.owner.maxHealth;
                this.advance();
                break;
            }   case "refillHP": {
                if(this.pend) {
                    break;
                }
                this.owner.health = this.owner.maxHealth;
                this.owner.resetHealthDisplay();
                this.advance();
                break;
            }   case "flashTitle": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addHitEffect(new TitleEffect(this.owner.scene,0,0,"eiffeltitle"));
                this.advance();
                break;
            }   case "sound": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.sound.play(this.cmd[this.step].args[0], {volume: this.cmd[this.step].value[0]});
                this.advance();
                break;
            }   case "fadeMusic": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.fadeMusic(this.cmd[this.step].value[0]);
                this.advance();
                break;
            }   case "swapMusic": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.swapMusic(this.cmd[this.step].value[0]);
                this.advance();
                break;
            }   case "store": {
                if(this.pend) {
                    break;
                }
                this.variableMap.set(this.cmd[this.step].args[0],this.cmd[this.step].value[0]);
                this.advance();
                break;
            }   case "warnTop": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addTextEffect(new TextEffect(this.owner.scene, this.cmd[this.step].value[0], this.cmd[this.step].value[1], "⚠      D   A   N   G   E   R   !      ⚠", "red", 80, true, "yellow",2500,250,0,0));
                this.advance();
                break;
            }   case "warnSide": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.addTextEffect(new TextEffect(this.owner.scene, this.cmd[this.step].value[0], this.cmd[this.step].value[1], "⚠\n\n"+"D\nA\nN\nG\nE\nR\n!\n"+ "\n⚠", "red", 80, true, "yellow",2500,250,0,0));
                this.advance();
                break;
            }   case "spaz": {
                if(this.pend) {
                    break;
                }
                this.owner.spaz = this.cmd[this.step].value[0];
                this.advance();
                break;
            }   case "turtle": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushEnemy(new Turtle(this.owner.scene,this.cmd[this.step].value[0],this.cmd[this.step].value[1],23));
                this.advance();
                break;
            }   case "circleSpam": {
                if(this.pend) {
                    break;
                }
                let ar = [this.owner.x-(this.cmd[this.step].value[0]/2)+(Math.random()*this.cmd[this.step].value[0]),this.owner.y-(this.cmd[this.step].value[1]/2)+(Math.random()*this.cmd[this.step].value[1])];
                let pinf = this.owner.getBulletType(this.cmd[this.step].value[2]);
                //pinf.velocity*=(0.9+(Math.random()*0.2));
                let rt = Math.random()*(360/this.cmd[this.step].value[3]);

                for(let nr = 0; nr < this.cmd[this.step].value[3]; nr++) {
                    pinf = this.owner.getBulletType(this.cmd[this.step].value[2]);
                    pinf.velocity*=(0.9+(Math.random()*0.2));
                    this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,ar[0],ar[1],rt,pinf,true,false));
                    rt += 360/this.cmd[this.step].value[3];
                    if(rt > 360) {
                        rt -= 360;
                    } else if (rt <-360) {
                        rt += 360;
                    }
                }
                this.owner.scene.sound.play(this.cmd[this.step].args[0], {volume:0.65});
                this.advance();
                break;
            }   case "aimSpreadDice": {
                if(this.pend) {
                    break;
                }
                let ar = [this.cmd[this.step].value[0],this.cmd[this.step].value[1]];
                let pinf = this.owner.getBulletType(18);
                pinf.velocity*=(0.9+(Math.random()*0.2));
                pinf.spinSpeed = -720+(Math.random()*1440);
                let rt = Math.atan2(this.owner.scene.activeTurret.y-ar[1], this.owner.scene.activeTurret.x-ar[0]);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,ar[0],ar[1],rt,pinf,true,false));
                pinf = this.owner.getBulletType(18);
                pinf.velocity*=(0.9+(Math.random()*0.2));
                pinf.spinSpeed = -720+(Math.random()*1440);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,ar[0],ar[1],rt-(Math.PI/12),pinf,true,false));
                pinf = this.owner.getBulletType(18);
                pinf.velocity*=(0.9+(Math.random()*0.2));
                pinf.spinSpeed = -720+(Math.random()*1440);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,ar[0],ar[1],rt+(Math.PI/12),pinf,true,false));
                this.advance();
                break;
            }   case "spinRocks": {
                if(this.pend) {
                    break;
                }
                let ar = this.variableMap.get(this.cmd[this.step].args[0])!;
                let pinf = this.owner.getBulletType(16);
                pinf.spinSpeed = (-240+Math.random()*480);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,this.owner.x,this.owner.y,ar*(Math.PI/180),pinf,true,false));
                ar += this.cmd[this.step].value[0];
                if(ar > 360) {
                    ar -= 360;
                } else if (ar < -360) {
                    ar += 360;
                }
                this.variableMap.set(this.cmd[this.step].args[0],ar);
                this.advance();
                break;
            }   case "spinfire": {
                if(this.pend) {
                    break;
                }
                let ar = this.variableMap.get(this.cmd[this.step].args[0])!;
                let pinf = this.owner.getBulletType(this.cmd[this.step].value[1]);
                pinf.spinSpeed = (-720+Math.random()*1440);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,this.owner.x,this.owner.y,ar*(Math.PI/180),pinf,true,false));
                ar += this.cmd[this.step].value[0];
                if(ar > 360) {
                    ar -= 360;
                } else if (ar < -360) {
                    ar += 360;
                }
                this.variableMap.set(this.cmd[this.step].args[0],ar);
                this.advance();
                break;
            }   case "shootRockBlast": {
                if(this.pend) {
                    break;
                }
                let dr = 180+(-45+Math.random()*90);
                let nr1 = 11+Math.trunc(Math.random()*2);
                let nr2 = 13+Math.trunc(Math.random()*2);
                this.owner.scene.addEnemyProjectile(new ExpandingProjectile(this.owner.scene,this.owner.x,this.owner.y,dr*(Math.PI/180),this.owner.getBulletType(nr1),true,false, this.owner.getBulletType(nr2)));
                this.advance();
                break;
            }   case "shootCorner": {
                if(this.pend) {
                    break;
                }
                let dd = [0,0];
                switch(this.cmd[this.step].value[0]){
                    case 0: {
                        dd = [0,0];
                        break;
                    } case 1: {
                        dd = [1920,0];
                        break;
                    } case 2: {
                        dd = [1920,1080];
                        break;
                    } case 3: {
                        dd = [0,1080];
                        break;
                    }
                }
                let ar = Math.random()*360;
                let rs = this.owner.getBulletType(10);
                for(let nn = 0; nn < 20; nn++) {
                    rs=this.owner.getBulletType(10);
                    rs.spinSpeed = -360+(Math.random()*720);
                    this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,dd[0],dd[1],ar*(Math.PI/180),rs,true, true));
                    ar += 18;
                }
                this.advance();
                break;
            }   case "nohit": {
                if(this.pend) {
                    break;
                }
                this.owner.noHitCheck = this.cmd[this.step].conditions[0];
                this.advance();
                break;
            }   case "setPosition": {
                if(this.pend) {
                    break;
                }
                this.owner.x=this.cmd[this.step].value[0];
                this.owner.y=this.cmd[this.step].value[1];
                this.advance();
                break;
            }   case "setVelocity": {
                if(this.pend) {
                    break;
                }
                this.owner.velocity = this.cmd[this.step].value;
                this.advance();
                break;
            }   case "setBkg": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.resetBackground(this.cmd[this.step].args);
                this.advance();
                break;
            }   case "resetAngle": {
                if(this.pend) {
                    break;
                }
                this.owner.resetAngle();
                this.advance();
                break;
            }   case "mandala": {
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
            }  case "crosses": {
                if(this.pend) {
                    break;
                }
                if(this.owner.crossAmount <= 0) {
                    let tx = 1;
                    if(Math.random() < 0.5) {
                        tx *= -1;
                    }
                    this.owner.scene.pushEnemy(new CrossEnemy(this.owner.scene, 800+(Math.random()*240),400,15,this.owner,tx));
                    this.owner.scene.pushEnemy(new CrossEnemy(this.owner.scene, 800+(Math.random()*240),680,15,this.owner,tx*-1));
                    this.owner.crossAmount += 2;
                }
                this.advance();
                break;
            }  case "soccer": {
                if(this.pend) {
                    break;
                }
                let xb = this.owner.getBulletType(5);
                switch(this.cmd[this.step].value[0]) {
                    case 0: {
                        this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, 960, 0-(100+450), Math.PI/2, xb, true));
                        break;
                    } case 1: {
                        this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, 1920+(100+450), 540, Math.PI, xb, true));
                        break;
                    } case 2: {
                        this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, 960, 1080+(100+450), 3*Math.PI/2, xb, true));
                        break;
                    } case 3: {
                        this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, 0-(100+450), 540, 0, xb, true));
                        break;
                    }
                }
                this.advance();
                break;
            }  case "supersoccer": {
                if(this.pend) {
                    break;
                }
                let xb = this.owner.getBulletType(9);
                this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, 1920+(100+450), 540, Math.PI, xb, true));
                this.advance();
                break;
            }   case "fadeMandala": {
                if(this.pend) {
                    break;
                }
                if((this.owner.hasMandala())){
                    this.owner.fadeMandala(this.cmd[this.step].value[0]);
                }
                this.advance();
                break;
            }   case "blaster": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushEnemy(new Blaster(this.owner.scene, 800+1120*Math.random(), 200+680*Math.random(),17));
                this.advance();
                break;
            }   case "blasterH": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushEnemy(new Blaster(this.owner.scene, 800+1120*Math.random(), 200+680*Math.random(),17,true));
                this.advance();
                break;
            }   case "assbaguette": {
                if(this.pend) {
                    break;
                }
                for(let nb = 0; nb < this.cmd[this.step].value[0]; nb++)
                {
                    this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene,2120,50+Math.random()*980,Math.PI,this.owner.getBulletType(6)));
                }
                this.advance();
                break;
            }   case "randomheroes": {
                if(this.pend) {
                    break;
                }
                let rh = 16;
                for(let nb = 0; nb < this.cmd[this.step].value[0]; nb++)
                {
                    if(Math.random() < 0.5) {
                        rh=18;
                    } else {
                        rh=19;
                    }
                    this.owner.scene.pushEnemy(new FallingEnemy(this.owner.scene,100+(1720*Math.random()),-200,rh));
                }
                this.advance();
                break;
            }   case "backspread": {
                if(this.pend) {
                    break;
                }
                let rst = "bigblue";
                let txr = 0;
                let snd = "sd";
                if(this.cmd[this.step].value[2] == 1) {
                    rst = "bigblack";
                    snd = "sn";
                }
                let rt = {
                    velocity: 600,
                    explode: false,
                    damage: 666,
                    sprite: rst,
                    duration: 10000,
                    radius: 31,
                    critChance: 1,
                    critDmg: 1.0,
                    useBox: false, boxParams: [10,10],
                    spin: false, spinSpeed: 0,
                }
                let rx = -100;
                let dxr = 10;
                let yvr = 50;
                let vl = 1;
                if(this.cmd[this.step].value[1] == 1) {
                    rx = 2020;
                    txr = 180;
                    vl = -1;
                    //yvr *= -1;
                }
                dxr *= vl;
                let yctr = 300+(Math.random()*480);
                this.owner.scene.sound.play(snd, {volume:0.5});
                this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                    rx, yctr,(txr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));
                rt = {
                    velocity: 500,
                    explode: false,
                    damage: 666,
                    sprite: rst,
                    duration: 10000,
                    radius: 31,
                    critChance: 1,
                    critDmg: 1.0,
                    useBox: false, boxParams: [10,10],
                    spin: false, spinSpeed: 0,
                }
                this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                    rx, yctr,(txr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));


                for(let dp = 0; dp < this.cmd[this.step].value[0]; dp++) {
                    rt = {
                        velocity: 600,
                        explode: false,
                        damage: 666,
                        sprite: rst,
                        duration: 10000,
                        radius: 31,
                        critChance: 1,
                        critDmg: 1.0,
                        useBox: false, boxParams: [10,10],
                        spin: false, spinSpeed: 0,
                    }
                    this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                        rx, yctr+yvr,(txr+dxr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));
                    rt = {
                        velocity: 500,
                        explode: false,
                        damage: 666,
                        sprite: rst,
                        duration: 10000,
                        radius: 31,
                        critChance: 1,
                        critDmg: 1.0,
                        useBox: false, boxParams: [10,10],
                        spin: false, spinSpeed: 0,
                    }
                    this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                        rx, yctr+yvr,(txr+dxr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));
                    rt = {
                        velocity: 600,
                        explode: false,
                        damage: 666,
                        sprite: rst,
                        duration: 10000,
                        radius: 31,
                        critChance: 1,
                        critDmg: 1.0,
                        useBox: false, boxParams: [10,10],
                        spin: false, spinSpeed: 0,
                    }    
                    this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                        rx, yctr-yvr,(txr-dxr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));
                    rt = {
                        velocity: 500,
                        explode: false,
                        damage: 666,
                        sprite: rst,
                        duration: 10000,
                        radius: 31,
                        critChance: 1,
                        critDmg: 1.0,
                        useBox: false, boxParams: [10,10],
                        spin: false, spinSpeed: 0,
                    }    
                    this.owner.scene.addEnemyProjectile(new ShadowedBullet(this.owner.scene,
                        rx, yctr-yvr,(txr-dxr)*(Math.PI/180),rt,this.cmd[this.step].value[2]));
                    dxr = 10*vl*(dp+1); 
                    yvr = 50*(dp+1);
                }
                this.advance();
                break;
            }   case "orbit": {
                if(this.pend) {
                    break;
                }
                this.owner.orbit([this.cmd[this.step].value[0],this.cmd[this.step].value[1]], this.cmd[this.step].value[2]);
                this.advance();
                break;
            }   case "unorbit": {
                if(this.pend) {
                    break;
                }
                this.owner.unorbit();
                this.advance();
                break;
            }   case "HPThreshold": {
                if(this.pend) {
                    break;
                }
                if((this.owner.health/this.owner.maxHealth) < (this.cmd[this.step].value[0])) {
                    this.advance();
                }
                break;
            }   case "stopOrbit": {
                if(this.pend) {
                    break;
                }
                if((!this.owner.disOrbit[0]) && (!this.owner.pending)) {
                    //console.log("STOP ORBIT");
                    this.owner.stopOrbit(this.cmd[this.step].value[0]);
                }
                //console.log("ORBIT STATUS: " + this.owner.disOrbit[0]);
                if(!this.owner.disOrbit[0]) {
                    this.owner.pending = false;
                    this.advance();
                }
                break;
            }   case "goToX": {
                if(this.pend) {
                    break;
                }
                if((!this.owner.towardsX) && (!this.owner.pending)) {
                    this.owner.goToX(this.cmd[this.step].value[0]);
                    console.log("GOING TO X");
                }
                console.log("X STATUS: " + this.owner.towardsX + " PEND: " + this.owner.pending);
                if(!this.owner.towardsX) {
                    this.owner.pending = false;
                    this.advance();
                }
                break;
            }  case "randomSnail": {
                if(this.pend) {
                    break;
                }
                let tt = Math.random()*360;
                for(let ns = 0; ns < this.cmd[this.step].value[0]; ns++) {
                    this.owner.scene.pushEnemy(new SnailEnemy(this.owner.scene, this.owner.x, this.owner.y, 20, 600, tt));
                    tt+=25;
                    if(tt > 360) {
                        tt -= 360;
                    }
                }
                this.advance();
                break;
            }  case "lives": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.gameData.lives = 99;
                this.advance();
                break;
            }  case "shatter": {
                if(this.pend) {
                    break;
                }
                let xa = 256;
                let ya = 430;
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(113-xa),this.owner.y+(193-ya),"f1",[-100+(Math.random()*-300),-50+(Math.random()*-350)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(262-xa),this.owner.y+(155-ya),"f2",[-125+(Math.random()*250),-50+(Math.random()*-400)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(351-xa),this.owner.y+(194-ya),"f3",[100+(Math.random()*300),-50+(Math.random()*-350)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(139-xa),this.owner.y+(435-ya),"f4",[-50+(Math.random()*-200),-50+(Math.random()*-350)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(246-xa),this.owner.y+(358-ya),"f5",[-175+(Math.random()*350),-120+(Math.random()*-420)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(168-xa),this.owner.y+(575-ya),"f6",[-100+(Math.random()*-300),-100+(Math.random()*-420)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(362-xa),this.owner.y+(551-ya),"f7",[100+(Math.random()*300),-100+(Math.random()*-420)],[0,550]));
                this.owner.scene.addHitEffect(new ParticleEffect(this.owner.scene,this.owner.x+(259-xa),this.owner.y+(676-ya),"f8",[-150+(Math.random()*300),-150+(Math.random()*-500)],[0,550]));
                this.advance();
                break;
            }  case "birds": {
                if(this.pend) {
                    break;
                }
                this.owner.addBirds();
                this.advance();
                break;
            }  case "shadow": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.shadow();
                this.advance();
                break;
            }  case "unshadow": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.unshadow();
                this.advance();
                break;
            }   case "waitCutscene": {
                if(this.pend) {
                    break;
                }
                if(!this.owner.scene.cutScene) {
                    this.advance();
                }
                break;
            }  case "setCutscene": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.setCutScene(this.cmd[this.step].args, this.cmd[this.step].value, this.cmd[this.step].conditions[0]);
                this.advance();
                break;
            }  case "teleTurret": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.activeTurret.x = (this.cmd[this.step].value[0]);
                this.owner.scene.activeTurret.y = (this.cmd[this.step].value[1]);
                this.advance();
                break;
            }  case "prorate": {
                if(this.pend) {
                    break;
                }
                this.owner.startProrate();
                this.advance();
                break;
            }  case "unprorate": {
                if(this.pend) {
                    break;
                }
                this.owner.stopProrate();
                this.advance();
                break;
            }  case "danmakuMode": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.activeTurret.danmakuDisplay();
                this.advance();
                break;
            }  case "freeMove": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.activeTurret.danmakuMode();
                this.advance();
                break;
            }  case "flash": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.setFlash(this.cmd[this.step].value[0]);
                this.advance();
                break;
            }  case "clear": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.despawnEnemies();
                this.owner.scene.despawnProjectiles();
                this.owner.despawnBirds();
                this.advance();
                break;
            }  case "nextScript": {
                if(this.pend) {
                    break;
                }
                console.log("QUEUEING SCRIPT: " + (this.owner.currentScript+1));
                this.owner.changeScript(this.owner.currentScript+1);
                break;
            }   case "changeSprite": {
                if(this.pend) {
                    break;
                }
                this.owner.changeSprite(this.cmd[this.step].args[0], this.cmd[this.step].value[0], this.cmd[this.step].value[1]);
                this.advance();
                break;
            }   case "endBoss": {
                if(this.pend) {
                    break;
                }
                this.owner.endBoss();
                this.advance();
                break;
            }
            break;
        }
    }

    shootCircle(amt: number, type: number, startAngle: number = 0, offset: number[] = [0,0], randomOffset: boolean, randomAngle: boolean){
        let myAngle = startAngle;
        let cx = 0;
        let cy = 0;
        //console.log("OFFSET: " +randomOffset);
        if(randomAngle) {
            myAngle = Math.random()*(360/amt);
        }
        if(randomOffset){
            cx = this.owner.x - offset[0] + 2*Math.random()*offset[0];
            cy = this.owner.y - offset[1] + 2*Math.random()*offset[1];
        } else {
            cx = this.owner.x + offset[0];
            cy = this.owner.y + offset[1];
        }

        for(let st = 0; st < amt; st++) {
            this.owner.scene.addEnemyProjectile(new EnemyProjectile(this.owner.scene, cx, cy, myAngle*(Math.PI/180), this.owner.getBulletType(type)));
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
            /*
            if(myAngle > 360) {
                myAngle -= 360;
            } else if (myAngle < -360) {
                myAngle += 360;
            }
            */
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

    resetVariables() {
        this.step = 0;
        this.variableMap = new Map<string, number>();
    }
}