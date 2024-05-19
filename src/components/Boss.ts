import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
import { BossCommand, BossAction } from "./BossCommand";
import { Mandala } from "./Mandala";
import { TwilightBird } from "./TwilightBird";

export class Boss extends Enemy {
    public script: BossCommand[];
    public scriptList: BossCommand[][];
    public spin: number = 0;
    public curSpinAngle: number = 0;
    private stopSpin: boolean = false;
    public currentScript: number = 0;
    public prorateDamage: number = 0;
    public prorateTimer: number = 1000;
    public prorating: boolean = false;
    public myMandala: Mandala[];
    public crossAmount: number = 0;
    public spaz: number = 0;
    public orbitalCenter: number[] = [0,0];
    public birds: TwilightBird[];
    public hasBirds: boolean =false;
    public rotating: boolean = false;
    public orbitCenter: number[] = [960,540];
    public rRad: number = 0;
    public rVel: number = 0;
    public aInit: number = 0;
    public deadFlag: boolean = false;
    public blink: boolean = false;
    public blinkTimer: number[] = [0,0,0,50];
    public towardsX: boolean = false;
    public towardsY: boolean = false;
    public destination:number[]=[0,0];
    public disOrbit: boolean[] = [false, true];
    public disOrbitLoc: number = 540;
    public pending: boolean = false;
    public tEl: number = 0;
    public maxdps: number = 6000;
    public dps: number = 0;
    public prr: boolean = false;
    
    constructor(scene: GameScene, x: number, y: number, type: number = 0) {
        super(scene, x, y, type);
        this.myMandala = [];
        this.scriptList = [[
            new BossCommand(this, [
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "prorate", value: [], args: [], conditions: []},
                //{key: "flashTitle", value: [], args: [], conditions: [false]},
            ]),
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
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.05], args: [], conditions: []},
                {key: "HPChange", value: [475000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],

        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "HPThreshold", value: [0.5], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "aimedCollidersSpread", value: [1,250,100,-10,10,-1000,1400], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "loop", value: [3], args: [], conditions: []},
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
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [550000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            
            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [2250], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "randomwalk_enemy", value: [2], args: [], conditions: []},
                {key: "wait", value: [10000], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            
            new BossCommand(this, [
                {key: "wait", value: [1350], args: [], conditions: []},
                {key: "bombardTop", value: [1,1], args: [], conditions: []},
                {key: "wait", value: [450], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [600000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [2700], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.85], args: ["meme_explosion"], conditions: []},
                {key: "flash", value: [1000], args: [], conditions: []},
                {key: "setBkg", value: [], args: ["ds0", "ds1", "ds2", "ds3", "ds4"], conditions: []},
                {key: "shatter", value: [], args: [], conditions: []},
                {key: "sound", value: [0.35], args: ["bigboom"], conditions: []},
                {key: "changeSprite", value: [1,1], args: ["finalboss_2"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "fadeMusic", value: [2500], args: [], conditions: []},
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "mandala", value: [2, 180, 1000, 0.75], args: ["mandala_brasil","charge_big"], conditions: [true]},
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "warnSide", value: [1720,540], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["warning3"], conditions: []},
                {key: "wait", value: [2200], args: [], conditions: []},
                {key: "setCutscene", value: [1000,2500,2500,0,0], args: ["transition_0","transition_1","transition_2"], conditions: [false]},
                {key: "wait", value: [300], args: [], conditions: []},
                {key: "supersoccer", value: [], args: [], conditions: []},
                {key: "sound", value: [0.65], args: ["slap"], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["lifeup"], conditions: []},
                {key: "lives", value: [], args: [], conditions: []},
                {key: "flash", value: [2500], args: [], conditions: []},
                {key: "danmakuMode", value: [], args: [], conditions: []},
                {key: "forceMove", value: [600], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "freeMove", value: [], args: [], conditions: []},
                {key: "swapMusic", value: [0], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),

        ],
        [

            /*RAY COMMANDS: 0:x 1:y 2:angle 3:dmg s0:lasertex s1:pointtex 4:radialwidth 5:pointradius
        6:rotation 7:laserscale 8:pointscale 9:idletime 10:chargetime 11:ontime 12:fadetime
        13:critchance chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250*/
            //Mandala commands: s0:texture, 0:maxscale, 1:rotation, 2:expansiontime, 3:alpha, b0:playsound, s1:soundfile
            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "crosses", value: [500], args: [], conditions: []},
                //{key: "randomwalk_enemy", value: [2], args: [], conditions: []},
                {key: "wait", value: [3750], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "wait", value: [3000], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "shootCircle", value: [20,3,0,40,400], args: [], conditions: [true,true]},
                {key: "wait", value: [1250], args: [], conditions: []},
                {key: "loop", value: [2], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "changeSprite", value: [1,1], args: ["finalboss_2"], conditions: []},

            ]),
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "laser", value: [0,0,180,450,36,72,0,1,1,1000,500,3000,500,1], args: ["yellow_laser","yellow_laser_origin"], conditions: []},
                {key: "sound", value: [0.25], args: ["laser"], conditions: []},
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
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [750000], args: [], conditions: []},
                {key: "refillHP", value: [], args:[], conditions:[]},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [

            /*RAY COMMANDS: 0:x 1:y 2:angle 3:dmg s0:lasertex s1:pointtex 4:radialwidth 5:pointradius
        6:rotation 7:laserscale 8:pointscale 9:idletime 10:chargetime 11:ontime 12:fadetime
        13:critchance chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250*/
            //Mandala commands: s0:texture, 0:maxscale, 1:rotation, 2:expansiontime, 3:alpha, b0:playsound, s1:soundfile
            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "HPThreshold", value: [0.8], args: [], conditions: []},
                {key: "wait", value: [400], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "spacedFishSplitFromBack", value: [3], args: [], conditions: [true,true]},
                {key: "wait", value: [1250], args: [], conditions: []},
                {key: "loop", value: [3], args: [], conditions: []},
            ]),
            /*
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "mandala", value: [2, 180, 1000, 0.75], args: ["mandala_brasil","charge_big"], conditions: [true]},
                {key: "wait", value: [5750], args: [], conditions: []},
                {key: "fadeMandala", value: [2000], args: [], conditions: []},
                {key: "wait", value: [5750], args: [], conditions: []},
                {key: "mandala", value: [2, -180, 1000, 0.75], args: ["mandala_brasil","charge_big"], conditions: [true]},

            ]),*/
            new BossCommand(this, [
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "spawnBush", value: [], args: [], conditions: []},
                {key: "wait", value: [32500], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "spaz", value: [2000], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "wait", value: [4000], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [500], args: [], conditions: []},
                //{key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [1500], args: [], conditions: []},
                //{key: "random_mines", value: [1], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [800000], args: [], conditions: []},
                {key: "refillHP", value: [], args:[], conditions:[] },
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [

            /*RAY COMMANDS: 0:x 1:y 2:angle 3:dmg s0:lasertex s1:pointtex 4:radialwidth 5:pointradius
        6:rotation 7:laserscale 8:pointscale 9:idletime 10:chargetime 11:ontime 12:fadetime
        13:critchance chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250*/
            //Mandala commands: s0:texture, 0:maxscale, 1:rotation, 2:expansiontime, 3:alpha, b0:playsound, s1:soundfile

            new BossCommand(this, [
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "spaz", value: [2000], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "circle_effect_centered", value: [0,0,1000,650,0xFFFFFF,50,1], args: [], conditions: []},
                {key: "circle_effect", value: [960,540,1000,650,0xFFFFFF,50,1], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "teleport", value: [960,540], args: [], conditions: []}, 
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "prorate", value: [], args: [], conditions: []},  
                {key: "resetAngle", value: [], args: [], conditions: []},       
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "wait", value: [4000], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [6000], args: [], conditions: []},
                {key: "storeSpinLaser", value: [0,0], args: ["sLAngle", "iLAngle"], conditions: []},
                {key: "wait", value: [50], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["laser"], conditions: []},
                {key: "spinLaser", value: [240,0.1,20,450,18,36,0,0.5,0.5,500,450,1500,450,1], args: ["yellow_laser","yellow_laser_origin","sLAngle", "iLAngle"], conditions: []},
                {key: "wait", value: [50], args: [], conditions: []},
                {key: "loop", value: [2], args: [], conditions: []},

            ]),
            new BossCommand(this, [
                {key: "wait", value: [7000], args: [], conditions: []},
                {key: "warnTop", value: [960,200], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["warning3"], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "soccer", value: [0], args: [], conditions: []},
                {key: "sound", value: [0.65], args: ["slap"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},

                {key: "warnSide", value: [1720,540], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["warning3"], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "soccer", value: [1], args: [], conditions: []},
                {key: "sound", value: [0.65], args: ["slap"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},

                {key: "warnTop", value: [960,880], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["warning3"], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "soccer", value: [2], args: [], conditions: []},
                {key: "sound", value: [0.65], args: ["slap"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},

                {key: "warnSide", value: [200,540], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["warning3"], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "soccer", value: [3], args: [], conditions: []},
                {key: "sound", value: [0.65], args: ["slap"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},

                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.1], args: [], conditions: []},
                {key: "HPChange", value: [825000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],

        //START OF FRANCE
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "fadeMandala", value: [2000], args: [], conditions: []},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [2700], args: [], conditions: []},
                {key: "sound", value: [1], args: ["meme_explosion_sound"], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [1], args: ["mc_expl1"], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "fadeMusic", value: [2500], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [1], args: ["meme_explosion_sound"], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "sound", value: [1], args: ["meme_explosion_sound"], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "sound", value: [1.75], args: ["mc_expl2"], conditions: []},
                {key: "randomExpl", value: [25,40,2.25], args: ["explosion_orange"], conditions: []},
                {key: "randomExpl", value: [25,40,3.25], args: ["explosion_orange"], conditions: []},
                {key: "randomExpl", value: [18,50,1.75], args: ["meme_explosion"], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "randomExpl", value: [18,50,3.75], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "setCutscene", value: [1000,4000,1500,4000,4000], args: ["bz_0","bz_1","bz_2","bz_3","bz_4","bz_5","bz_6","bz_7","bz_8"], conditions: [true]},
                {key: "changeSprite", value: [1,1], args: ["eiffel"], conditions: []},
                {key: "flashTitle", value: [], args: [], conditions: []},
                {key: "setPosition", value: [1500,540], args: [], conditions: []},
                {key: "wait", value: [3750], args: [], conditions: []},
                {key: "mandala", value: [2, 180, 1000, 0.75], args: ["mandala_french","charge_big"], conditions: [true]},
                //{key: "flash", value: [4000], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                //{key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [1250], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [

            /*RAY COMMANDS: 0:x 1:y 2:angle 3:dmg s0:lasertex s1:pointtex 4:radialwidth 5:pointradius
        6:rotation 7:laserscale 8:pointscale 9:idletime 10:chargetime 11:ontime 12:fadetime
        13:critchance chargealpha: number = 0.6, fadealpha: number = 0.6, onalpha: number=0.85, ticktimer: number = 250*/
            //Mandala commands: s0:texture, 0:maxscale, 1:rotation, 2:expansiontime, 3:alpha, b0:playsound, s1:soundfile

            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [150], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["breadhit"], conditions: []},
                {key: "assbaguette", value: [1], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "wait", value: [5000], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "randomheroes", value: [1], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [4500], args: [], conditions: []},
                {key: "blaster", value: [], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "blaster", value: [], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "blaster", value: [], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["shot-1"], conditions: []},
                {key: "shootCorner", value: [0], args: [], conditions: []},
                {key: "wait", value: [150], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["shot-1"], conditions: []},
                {key: "shootCorner", value: [1], args: [], conditions: []},
                {key: "wait", value: [650], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["shot-1"], conditions: []},
                {key: "shootCorner", value: [2], args: [], conditions: []},
                {key: "wait", value: [150], args: [], conditions: []},
                {key: "sound", value: [0.25], args: ["shot-1"], conditions: []},
                {key: "shootCorner", value: [3], args: [], conditions: []},
                {key: "wait", value: [150], args: [], conditions: []},
                {key: "wait", value: [6500], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]), 
            new BossCommand(this, [
                {key: "wait", value: [3500], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [0.4], args: ["thshoot"], conditions: []},
                {key: "shootRockBlast", value: [0], args: [], conditions: []},
                {key: "wait", value: [1600], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [0.4], args: ["thshoot"], conditions: []},
                {key: "shootRockBlast", value: [0], args: [], conditions: []},
                {key: "wait", value: [4600], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]), 
            new BossCommand(this, [
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "circle_effect", value: [960,540,500,300,0xFFFFFF,20,1], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "sound", value: [0.5], args: ["tspawn"], conditions: []},
                {key: "turtle", value: [960,540], args: [], conditions: []},
                {key: "wait", value: [2500], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]), 
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [700000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [{key: "wait", value: [1000], args: [], conditions: []},
                {key: "birds", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [6000], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "spaz", value: [6000], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "storeRandomTele", value: [], args: ["tsx","tsy"], conditions: []},
                {key: "warnTele", value: [], args: ["tsx","tsy"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "getTele", value: [], args: ["tsx","tsy"], conditions: []},
                {key: "resetAngle", value: [0], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},            
                {key: "randomSnail", value: [6], args: [], conditions: []},
                {key: "wait", value: [3000], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.75], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "backspread", value: [4,0,0], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "backspread", value: [4,0,1], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "backspread", value: [4,1,0], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "backspread", value: [4,1,1], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [3000], args: [], conditions: []},
                {key: "shadow", value: [1], args: [], conditions: []},
                {key: "wait", value: [3000], args: [], conditions: []},
                {key: "unshadow", value: [1], args: [], conditions: []},
                {key: "wait", value: [3000], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [1100000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "unshadow", value: [1], args: [], conditions: []},
                {key: "resetAngle", value: [0], args: [], conditions: []},
                //{key: "nextScript", value: [], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]), 
        ],
        [
            new BossCommand(this, [
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "spaz", value: [6000], args: [], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "storeTele", value: [1060,300], args: ["rsx","rsy"], conditions: []},
                {key: "warnTele", value: [], args: ["rsx","rsy"], conditions: []},
                {key: "wait", value: [2000], args: [], conditions: []},
                {key: "getTele", value: [], args: ["rsx","rsy"], conditions: []},
                {key: "resetAngle", value: [0], args: [], conditions: []},
                {key: "orbit", value: [1060,540,-120], args: [], conditions: []},
                {key: "spin", value: [120], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "prorate", value: [], args: [], conditions: []},            
            ]),
            new BossCommand(this, [
                {key: "wait", value: [6000], args: [], conditions: []},
                {key: "aimSpreadPans", value: [3], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "wait", value: [10000], args: [], conditions: []},
                {key: "backlaser", value: [1920,100,180,450,36,72,0,1,1,1000,500,1500,500,1], args: ["yellow_laser","yellow_laser_origin"], conditions: []},
                {key: "wait", value: [4500], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "wait", value: [8000], args: [], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "trojan", value: [], args: [], conditions: []},
                {key: "wait", value: [7500], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [16000], args: [], conditions: []},
                {key: "dice", value: [1], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "dice", value: [1], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "dice", value: [1], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "wait", value: [600], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "HPChange", value: [1600000], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "resetAngle", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [1400], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.5], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},

            ]), 
            new BossCommand(this, [
                {key: "stopOrbit", value: [540], args: [], conditions: []},
                {key: "setVelocity", value: [250,0], args: [], conditions: []},
                {key: "goToX", value: [1500], args: [], conditions: []},
                {key: "spin", value: [360], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [false]},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "prorate", value: [], args: [], conditions: []},
                {key: "wait", value: [1000], args: [], conditions: []},
                {key: "store", value: [0], args: ["spna"], conditions: []},
                {key: "wait", value: [50], args: [], conditions: []},
                {key: "spinRocks", value: [47], args: ["spna"], conditions: []},
                {key: "loop", value: [3], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "wait", value: [2200], args: [], conditions: []},
                {key: "store", value: [0], args: ["spnt"], conditions: []},
                {key: "wait", value: [125], args: [], conditions: []},
                {key: "spinfire", value: [-39,17], args: ["spnt"], conditions: []},
                {key: "sound", value: [0.45], args: ["big_gun_1"], conditions: []},
                {key: "loop", value: [2], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.6], args: [], conditions: []},
                {key: "blasterH", value: [], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "blasterH", value: [], args: [], conditions: []},
                {key: "wait", value: [3500], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "HPThreshold", value: [0.9], args: [], conditions: []},
                {key: "sound", value: [0.6], args: ["thshoot"], conditions: []},
                {key: "aimSpreadDice", value: [1920,200], args: [], conditions: []},
                {key: "wait", value: [30], args: [], conditions: []},
                {key: "aimSpreadDice", value: [1920,200], args: [], conditions: []},
                {key: "wait", value: [500], args: [], conditions: []},
                {key: "sound", value: [0.6], args: ["thshoot"], conditions: []},
                {key: "aimSpreadDice", value: [1920,880], args: [], conditions: []},
                {key: "wait", value: [30], args: [], conditions: []},
                {key: "aimSpreadDice", value: [1920,880], args: [], conditions: []},
                {key: "wait", value: [750], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.8], args: [], conditions: []},
                //{key: "wait", value: [10000], args: [], conditions: []},
                {key: "wait", value: [200], args: [], conditions: []},
                {key: "assbaguette", value: [1], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),
            new BossCommand(this, [
                {key: "HPThreshold", value: [0.35], args: [], conditions: []},
                {key: "circleSpam", value: [500,240,19,24], args: ["sd"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "circleSpam", value: [500,240,22,36], args: ["sn"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "circleSpam", value: [700,340,24,36], args: ["sn"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "circleSpam", value: [500,240,20,24], args: ["sn"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "circleSpam", value: [500,240,21,36], args: ["sd"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "circleSpam", value: [700,340,23,36], args: ["sd"], conditions: []},
                {key: "wait", value: [100], args: [], conditions: []},
                {key: "loop", value: [1], args: [], conditions: []},
            ]),

            new BossCommand(this, [
                {key: "HPThreshold", value: [0.01], args: [], conditions: []},
                {key: "refillHP", value: [], args: [], conditions: []},
                {key: "unprorate", value: [], args: [], conditions: []},
                {key: "nextScript", value: [], args: [], conditions: []},
            ]),
        ],
        [
            new BossCommand(this, [
                {key: "clear", value: [], args: [], conditions: []},
                {key: "nohit", value: [], args: [], conditions: [true]},
                {key: "fadeMandala", value: [2000], args: [], conditions: []},
                {key: "sound", value: [1], args: ["smash_1"], conditions: []},
                {key: "blink", value: [15000], args: [], conditions: []},
                {key: "sound", value: [1.25], args: ["mc_expl2"], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [1.25], args: ["mc_expl1"], conditions: []},
                {key: "randomExpl", value: [25,40,1.75], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "fadeMusic", value: [2500], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.75], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [250], args: [], conditions: []},
                {key: "sound", value: [1.25], args: ["meme_explosion_sound"], conditions: []},
                {key: "randomExpl", value: [25,40,2.25], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,2.75], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "sound", value: [1], args: ["mc_expl2"], conditions: []},
                {key: "randomExpl", value: [25,40,3], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [18,50,3.25], args: ["meme_explosion"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "sound", value: [1.25], args: ["mc_expl1"], conditions: []},
                {key: "sound", value: [1.25], args: ["meme_explosion_sound"], conditions: []},
                {key: "randomExpl", value: [25,40,3], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [350], args: [], conditions: []},
                {key: "randomExpl", value: [25,40,3.25], args: ["explosion_orange"], conditions: []},
                {key: "wait", value: [1050], args: [], conditions: []},
                {key: "flash", value: [500], args: [], conditions: []},
                {key: "slowExpl", value: [18,100,10.5], args: ["meme_explosion"], conditions: []},
                {key: "endBoss", value: [500], args: [], conditions: []},
            ]), 
        ],
        
        ];
        this.script = this.scriptList[this.currentScript];
        this.curSpinAngle = this.angle;
        this.birds = [];
        this.setDepth(2);
    }



    updateMovement(d: number, t: number){
        this.x += (this.slow*this.velocity[0])*d/1000;
        this.y += (this.slow*this.velocity[1])*d/1000;
        this.velocity[0] += this.myInfo.ax * (d/1000);
        this.velocity[1] += this.myInfo.ay * (d/1000);

        if(this.bounce){
            this.y += this.slow*this.amplitude*4*Math.sin((this.offset+t)/250);
        }
        if(this.slowTimer > 0) {
            this.slowTimer -= d;
            if(this.slowTimer <= 0) {
                this.slowTimer = 0;
                this.slow = 1;
            }
        }
        this.handleReflect();
        if(this.towardsX) {
            if(this.x > this.destination[0]) {
                this.x=this.destination[0];
                this.towardsX = false;
                this.velocity=[0,0];
                this.pending = true;
                console.log("X COMPLETE");
            }
        }
    }

    update(d: number, t: number) {
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
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
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
        if(this.prr) {
            this.tEl += (d/1000);

            let mh = (this.maxHealth-this.health);
            //console.log("HEALTHLOSS: " + mh);
            //console.log("TIME: " + this.tEl);

            if(mh == 0) {
                this.dmgRes = 1;
            } else {
                //console.log("RE DPS: " + (mh/this.tEl));
                this.dps = (mh/this.tEl);
               // console.log("DPS: " + this.dps);
                let rd = this.maxdps/this.dps;
                this.scene.spValue=rd;
                if(rd > 2) {
                    rd = 2;
                }
                if(rd < 0.01) {
                    rd = 0.01;
                }
                this.dmgRes = rd;
                if(this.tEl > 24) {
                    this.dmgRes=2;
                }
            }
        }
        if(this.hasBirds && (this.birds.length > 0))
        {
            for(let br = this.birds.length-1; br >= 0; br--) {
                this.birds[br].update(d,t);
                if(this.birds[br].deleteFlag){
                    this.birds[br].destroy();
                    this.birds.splice(br,1);
                }
            }
            if(this.birds.length <= 0) {
                this.hasBirds = false;
            }
        }
        if(this.blink) {
            if(this.blinkTimer[0] > 0) {
                this.blinkTimer[0]-=d;
                this.blinkTimer[1]-=d;

                if(this.blinkTimer [0] <= 0) {
                    this.blink = false;
                    this.mySprite.setAlpha(1);
                    this.blinkTimer = [0,0,0,50];
                }

                if(this.blinkTimer[1] <= 0) {
                    this.blinkTimer[1] = this.blinkTimer[3];
                    if(this.blinkTimer[2] == 1)  {
                        this.setAlpha(0.25);
                        this.blinkTimer[2] = 0;
                    } else {
                        this.setAlpha(1);
                        this.blinkTimer[2] = 1;
                    }
                }
            }
        }

    }

    startProrate(){
        this.prr = true;
        this.dps = 0;
        this.tEl = 0;
        this.dmgRes = 1;
    }

    stopProrate(){
        this.prr = false;
        this.dps = 0;
        this.tEl = 0;
        this.dmgRes = 1;
    }

    updateSpawnCheck(): void {
        
    }

    setBlink(n: number) {
        this.blink = true;
        this.blinkTimer[0] = n;
    }

    despawnBirds() {
        for(let br = this.birds.length-1; br >= 0; br--) {
            this.birds[br].erase();
        }
    }

    changeScript(n: number) {
        if(n >= this.scriptList.length) {
            n = this.scriptList.length-1;
        }
        if(n < 0) {
            n = 0;
        }
        for(let l = 0; l < this.script.length; l++) {
            this.script[l].resetVariables();
        }
        console.log("EXECUTING SCRIPT:  "+ n);
        this.currentScript = n;
        this.script = this.scriptList[n];
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

        if(this.spaz > 0) {
            this.spaz -= d;
            this.setAngle(Math.random()*360);
        }


        if(this.rotating) {
            this.aInit += (this.rVel*d/1000*(Math.PI/180));
            if(this.aInit > (2*Math.PI)) {
                this.aInit -= (2*Math.PI);
            } else if (this.aInit < (-2*Math.PI)) {
                this.aInit += (2*Math.PI);
            }
            if(this.bounce) {
                this.rRad += this.slow*this.amplitude*Math.sin((this.offset+t)/250);
            }
            this.x=this.orbitCenter[0]+Math.cos(this.aInit)*this.rRad;
            this.y=this.orbitCenter[1]+Math.sin(this.aInit)*this.rRad;
            if(this.disOrbit[0]) {
                if(this.disOrbit[1]) {
                    if(this.y >= this.disOrbitLoc) {
                        this.disOrbit[0] = false;
                        this.rotating = false;
                        this.velocity=[0,0];
                        this.y = this.disOrbitLoc;
                        //console.log("ORBIT COMPLETE");
                        this.pending = true;
                    }
                } else {
                    if (this.y <= this.disOrbitLoc) {
                        this.disOrbit[0] = false;
                        this.rotating = false;
                        this.velocity=[0,0];
                        this.y = this.disOrbitLoc;
                        //console.log("ORBIT COMPLETE");
                        this.pending = true;
                    }
                }
            }
        }
    }

    goToX(n: number) {
        this.towardsX = true;
        this.destination[0] = n;
        this.pending = false;
    }

    stopOrbit(y: number = 540){
        this.disOrbit[0] = true;
        if(this.y < y) {
            this.disOrbit[1] = true;
        } else {
            this.disOrbit[1] = false;
        }
        this.disOrbitLoc=y;
        this.pending = false;
    }

    orbit(n: number[], v: number){
        this.rotating = true;
        this.orbitCenter = n;
        this.rRad = Math.hypot(this.x-this.orbitCenter[0], this.y-this.orbitCenter[1]);
        this.rVel = v;
        this.aInit = Math.atan2(this.y-this.orbitCenter[1],this.x-this.orbitCenter[0]);
    }

    unorbit() {
        this.rotating = false;
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
            this.script = [];
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

    resetAngle(){
        this.spaz = 0;
        this.setAngle(0);
    }

    unSpin(){
        this.stopSpin = true;
    }

    addBirds() {
        if(this.birds.length <= 0) {
            this.birds.push(new TwilightBird(this.scene,this.x,this.y,this,0));
            this.birds.push(new TwilightBird(this.scene,this.x,this.y,this,1));
        }
        this.hasBirds = true;
    }

    fadeMandala(n: number){
        if(this.myMandala.length >= 1) {
            this.myMandala[0].setFade(n);
        }
    }

    endBoss(){
        this.scene.sound.play("giantboom", {volume:0.5});
        //this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        //this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.maxHealth) +" €", "yellow", 60, true, "white", 800, 100, 0.7, 0));
        this.deleteFlag = true;
    }

    die(){
        this.deadFlag = true;
    }

    addMandala(m: Mandala) {
        this.myMandala.push(m);
    }

    
    resetHealthDisplay(){
        this.hpDisplay.setAlpha(1);
        this.hpDisplay.setVisible(false);
        this.deadFlag = false;
    }

    hasMandala() {
        if(this.myMandala.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}