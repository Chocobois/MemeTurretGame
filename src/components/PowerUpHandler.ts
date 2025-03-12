import { BaseScene } from "@/scenes/BaseScene";
import { PowerUp } from "./PowerUp";
import { pColor } from "./PowerUp";
import { PowerUpButton } from "./PowerUpButton";

export interface TurretParams{
    baseDamage: number;
    critChance: number; critDmg: number; critMod: number;
    rof: number; acc: number;
    shotgun: boolean; shotgunPellets: number; shotgunDmg: number;
    pspeed: number;
    onHit: number;
    chainCrit: number;
    percentPen: number; flatPen: number;
    slow: number;
    canPierce: boolean; pierceCount: number; pierceTimer: number; pierceMod: number;
    canExplode: boolean; explRad: number; explDmg: number; explCount: number;
    flatGold: number; onHitGold: number;
    canSmite: boolean; smitePercent: number;
    missiles: boolean; missileCount: number; missileDmg: number; missileCharge: number;
    useScaling: boolean, scalingFactor: number; scalingAmount: number;
    flak: boolean; flakAmount: number; flakPierce: number;
    burst: boolean; burstAmount: number;
    onhitchain: boolean; onhitchainchance: number;

}
export enum powerID {
    NULL = 0,
    
    PLAIN_GRAY=1, PLAIN_RED=2, PLAIN_BLUE=3, PLAIN_GOLD=4, PLAIN_RAINBOW=5,

    //GRAY
    BASE_DMG=6, FLAT_CRIT=7, SPEED=8, ROF=9,

    //RED
    SHOTGUN=10, ONHIT_DMG=11, CHAIN_CRIT=12, ARMOR_PEN=13,

    //BLUE
    LOOP=14, SLOW=15, PIERCE=16, DOUBLE_CRIT=17,

    //GOLD
    EXPLODE=18, TURBO_ROF=19, FLAT_GOLD=20, GOLD_ON_HIT=21,

    //RAINBOW
    SQUARED_DMG=22, SMITE=23, MISSILES=24, SCALING_DMG=25,
}

export enum varID{
    BASE_DAMAGE=0, CRIT_CHANCE=1, CRIT_DAMAGE=2, 
    ROF=3, PSPEED=4, ONHIT=5, CHAIN_CRIT=6,
    ARPEN=7, SLOW=8, PIERCE_COUNT=9, PIERCE_TIMER=10, PIERCE_MODIFIER=11, 
    EXPL_RAD=12, EXP_DMG=13, EXP_COUNT=14, ACC=15,
    FLAT_GOLD=16, GOLD_ONHIT=17, SMITE_DMG=18,
    MISSILE_COUNT=19, MISSILE_DMG=20, MISSILE_CHARGE=21,
    SHOTGUN_PELLETS=22, SHOTGUN_DMG=23, PERCENT_PEN=24, FLAT_PEN=25,
    SCALING_FACTOR=26, SCALING_AMOUNT=27
}

export class PowerUpHandler{
    public scene: BaseScene;

    public modifier: boolean = true;
    //
    private baseDamage: number = 0;
    private onHit: number = 0;
    public widgetTable: PowerUp[];
    //calculate after the fact
    private exponent: number = 0;
    private nextWidget: number = 0;
    private currentIterations: number = 0;
    private colorPairs: Map<number, number>;
    public currentBingos: Map<number, number>;
    private powerUpTable: Map<number, number[]>;
    public defaultParam: TurretParams;
    public workingParam: TurretParams;
    private bingoBoard: number[] = [0,0,0,0,0];

    constructor(scene: BaseScene){
        this.scene = scene;
        this.currentBingos = new Map();
        this.currentBingos.set(pColor.GRAY, 0);
        this.currentBingos.set(pColor.RED, 0);
        this.currentBingos.set(pColor.BLUE, 0);
        this.currentBingos.set(pColor.GOLD, 0);
        this.currentBingos.set(pColor.RAINBOW, 0);

        this.widgetTable = [];
        this.initializeWidgets();
        this.colorPairs = new Map();
        this.setColorPairs();
        this.powerUpTable = new Map();
        this.setPowerUpTable();
		this.defaultParam = {
            baseDamage: 15,
            critChance: 0, critDmg: 0, critMod: 1,
            rof: 1, acc: 0,
            shotgun: false, shotgunPellets: 0, shotgunDmg: 0,
            pspeed: 1,
            onHit: 0,
            chainCrit: 0,
            percentPen: 1, flatPen: 0,
            slow: 1,
            canPierce: false, pierceCount: 3, pierceTimer: 1, pierceMod: 1,
            canExplode: false, explRad: 0, explDmg: 0, explCount: 0,
            flatGold: 0, onHitGold: 0,
            canSmite: false, smitePercent: 1,
            missiles: false, missileCount: 1, missileDmg: 100, missileCharge: 100,
            useScaling: false, scalingFactor: 1000000, scalingAmount: 0,
            flak: false, flakAmount: 0, flakPierce: 3,
            burst: false, burstAmount: 1,
            onhitchain: false, onhitchainchance: 0,
        
        };

        this.workingParam = {
            baseDamage: 15,
            critChance: 0, critDmg: 0, critMod: 1,
            rof: 1, acc: 0,
            shotgun: false, shotgunPellets: 0, shotgunDmg: 0,
            pspeed: 1,
            onHit: 0,
            chainCrit: 0,
            percentPen: 1, flatPen: 0,
            slow: 1,
            canPierce: false, pierceCount: 3, pierceTimer: 1, pierceMod: 1,
            canExplode: false, explRad: 0, explDmg: 0, explCount: 0,
            flatGold: 0, onHitGold: 0,
            canSmite: false, smitePercent: 1,
            missiles: false, missileCount: 1, missileDmg: 100, missileCharge: 100,
            useScaling: false, scalingFactor: 1000000, scalingAmount: 0,
            flak: false, flakAmount: 0, flakPierce: 3,
            burst: false, burstAmount: 1,
            onhitchain: false, onhitchainchance: 0,
        };
        //[base damage, critical chance, critical damage, on-hit damage, ]
    }

    setPowerUpTable(){
        this.powerUpTable.set(powerID.NULL, [0]);
        this.powerUpTable.set(powerID.PLAIN_GRAY, [0]);
        this.powerUpTable.set(powerID.BASE_DMG, [10]);
        this.powerUpTable.set(powerID.FLAT_CRIT, [0.15]);
        this.powerUpTable.set(powerID.SPEED, [0.2]);
        this.powerUpTable.set(powerID.ROF, [0.20]);

        this.powerUpTable.set(powerID.PLAIN_RED, [0]);
        this.powerUpTable.set(powerID.SHOTGUN, [2, 0.3]); //number of pellets, damage %
        this.powerUpTable.set(powerID.ONHIT_DMG, [30]);
        this.powerUpTable.set(powerID.CHAIN_CRIT, [0.30]);
        this.powerUpTable.set(powerID.ARMOR_PEN, [0.6, 3]); //percent, flat

        this.powerUpTable.set(powerID.PLAIN_BLUE, [0]); 
        this.powerUpTable.set(powerID.LOOP, [1]);
        this.powerUpTable.set(powerID.SLOW, [0.6]);
        this.powerUpTable.set(powerID.PIERCE, [2, 1, 0.6]);
        this.powerUpTable.set(powerID.DOUBLE_CRIT, [2]);

        this.powerUpTable.set(powerID.PLAIN_GOLD, [0]);
        this.powerUpTable.set(powerID.EXPLODE, [75,0.75,1]); //radius, damage percent, number of explosions
        this.powerUpTable.set(powerID.TURBO_ROF, [0.4, 1.5]); //amount, percent inaccuracy
        this.powerUpTable.set(powerID.FLAT_GOLD, [10]);
        this.powerUpTable.set(powerID.GOLD_ON_HIT, [1]);

        this.powerUpTable.set(powerID.PLAIN_RAINBOW, [0]);
        this.powerUpTable.set(powerID.SQUARED_DMG, [2]);
        this.powerUpTable.set(powerID.SMITE, [0.85]);
        this.powerUpTable.set(powerID.MISSILES, [1,25,5]); //amount, damage, cooldown
        this.powerUpTable.set(powerID.SCALING_DMG, [10000, 0.05]); //per x amount of score, amount of boost
    }

    setColorPairs(){
        this.colorPairs.set(powerID.NULL, pColor.NULL);
        this.colorPairs.set(powerID.PLAIN_GRAY, pColor.GRAY);
        this.colorPairs.set(powerID.BASE_DMG, pColor.GRAY);
        this.colorPairs.set(powerID.FLAT_CRIT, pColor.GRAY);
        this.colorPairs.set(powerID.SPEED, pColor.GRAY);
        this.colorPairs.set(powerID.ROF, pColor.GRAY);

        this.colorPairs.set(powerID.PLAIN_RED, pColor.RED);
        this.colorPairs.set(powerID.SHOTGUN, pColor.RED);
        this.colorPairs.set(powerID.ONHIT_DMG, pColor.RED);
        this.colorPairs.set(powerID.CHAIN_CRIT, pColor.RED);
        this.colorPairs.set(powerID.ARMOR_PEN, pColor.RED);

        this.colorPairs.set(powerID.PLAIN_BLUE, pColor.BLUE); 
        this.colorPairs.set(powerID.LOOP, pColor.BLUE);
        this.colorPairs.set(powerID.SLOW, pColor.BLUE);
        this.colorPairs.set(powerID.PIERCE, pColor.BLUE);
        this.colorPairs.set(powerID.DOUBLE_CRIT, pColor.BLUE);

        this.colorPairs.set(powerID.PLAIN_GOLD, pColor.GOLD);
        this.colorPairs.set(powerID.EXPLODE, pColor.GOLD);
        this.colorPairs.set(powerID.TURBO_ROF, pColor.GOLD);
        this.colorPairs.set(powerID.FLAT_GOLD, pColor.GOLD);
        this.colorPairs.set(powerID.GOLD_ON_HIT, pColor.GOLD);

        this.colorPairs.set(powerID.PLAIN_RAINBOW, pColor.RAINBOW);
        this.colorPairs.set(powerID.SQUARED_DMG, pColor.RAINBOW);
        this.colorPairs.set(powerID.SMITE, pColor.RAINBOW);
        this.colorPairs.set(powerID.MISSILES, pColor.RAINBOW);
        this.colorPairs.set(powerID.SCALING_DMG, pColor.RAINBOW);
    }

    //process widgets in forward direction
    //ONLY NEED TO CALL THIS WHEN WIDGETS ARE CHANGED



    initializeWidgets(){
        for(let i = 0; i < 9; i++) {
            this.widgetTable.push(new PowerUp(powerID.NULL, [0], pColor.GRAY));
        }
    }

    tableIsEmpty(): boolean{
        let empty = true;
        for(let z = 0; z < this.widgetTable.length; z++){
            if(this.widgetTable[z].ID != powerID.NULL) {
                empty = false;
            }
        }
        return empty;
    }

    boardToPowerUpList(px: PowerUpButton[]){
        if(!(px.length == 9)) {
            return;
        }
        for(let n = 0; n < 9; n++) {
            this.widgetTable[n] = new PowerUp(px[n].pType, this.powerUpTable.get(px[n].pType)!, px[n].color);
        }
    }

    processPowerUps(params: TurretParams): TurretParams{
        this.nextWidget = 0;
        this.baseDamage = params.baseDamage;
        let i = 0;
        this.workingParam = params;
        while(this.nextWidget < this.widgetTable.length) {
            i++;
            this.currentIterations = 0;
            this.processForward(this.nextWidget);
            if(i > 100){
                break;
            }
        }
        return this.workingParam;
    }

    processForward(n: number){
        //console.log("index: " + n + " widget: ");
        //console.log(this.widgetTable[n]);
        switch(this.widgetTable[n].ID!) {
            case powerID.NULL: {
                this.nextWidget++;
                break;
            } case powerID.PLAIN_GRAY: {
                this.nextWidget++;
                break;
            } case powerID.PLAIN_RED: {
                this.nextWidget++;
                break;
            } case powerID.PLAIN_BLUE: {
                this.nextWidget++;
                break;
            } case powerID.PLAIN_GOLD: {
                this.nextWidget++;
                break;
            } case powerID.PLAIN_RAINBOW: {
                this.nextWidget++;
                break;
            } case powerID.BASE_DMG: { //GRAY
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.baseDamage += this.currentIterations*this.widgetTable[n].value[0];
                this.baseDamage += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.FLAT_CRIT: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.critChance += this.currentIterations*this.widgetTable[n].value[0];
                break;  
            } case powerID.SPEED: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.pspeed += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.ROF: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.rof += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.SHOTGUN: { //RED
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.shotgun = true;
                this.workingParam.shotgunPellets += this.currentIterations*this.widgetTable[n].value[0];
                this.workingParam.shotgunDmg = this.widgetTable[n].value[1];
                break;
            } case powerID.ONHIT_DMG: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.onHit += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.CHAIN_CRIT: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.chainCrit += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.ARMOR_PEN: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.percentPen *= Math.pow(this.widgetTable[n].value[0],this.currentIterations);
                if(this.workingParam.percentPen > 1) {
                    this.workingParam.percentPen = 1;
                }
                this.workingParam.flatPen += this.currentIterations*this.widgetTable[n].value[1];
                break;
            } case powerID.SLOW: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                for(let s = 0; s < this.currentIterations; s++) {
                    this.workingParam.slow *= this.widgetTable[n].value[0];
                }
                break;
            } case powerID.PIERCE: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.canPierce = true;
                this.workingParam.pierceCount += this.currentIterations*this.widgetTable[n].value[0]
                this.workingParam.pierceTimer = this.widgetTable[n].value[1]
                this.workingParam.pierceMod = this.widgetTable[n].value[2];
                break;
            } case powerID.DOUBLE_CRIT: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.critMod += Math.pow(this.widgetTable[n].value[0], this.currentIterations);
                this.workingParam.critChance *= Math.pow(2,this.currentIterations);
                this.workingParam.chainCrit *= Math.pow(2,this.currentIterations);
                break;
            } case powerID.EXPLODE: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.canExplode = true;
                this.workingParam.explRad = this.widgetTable[n].value[0];
                this.workingParam.explDmg = this.widgetTable[n].value[1];
                this.workingParam.explCount += this.currentIterations*this.widgetTable[n].value[2];
                break;
            } case powerID.TURBO_ROF: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.canExplode = true;
                this.workingParam.rof += this.currentIterations*this.widgetTable[n].value[0];
                this.workingParam.acc += this.currentIterations*this.widgetTable[n].value[1];
                break;
            } case powerID.FLAT_GOLD: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.flatGold += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.GOLD_ON_HIT: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.onHitGold += this.currentIterations*this.widgetTable[n].value[0];
                break;
            } case powerID.SQUARED_DMG: { //RAINBOW
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.baseDamage += Math.pow(this.baseDamage+(this.currentIterations-1),2);
                this.workingParam.missileCount += Math.pow(this.workingParam.missileCount+(this.currentIterations-1),2);

                this.workingParam.onhitchain = true;
                this.workingParam.onhitchainchance += 0.1*this.currentIterations;
                break;
            } case powerID.SMITE: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.canSmite = true;
                for(let sm = 0; sm < this.currentIterations; sm++) {
                    this.workingParam.smitePercent *= this.widgetTable[n].value[0];
                }
                break;
            } case powerID.MISSILES: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.missiles = true;
                this.workingParam.missileCount += this.currentIterations*this.widgetTable[n].value[0];
                this.workingParam.missileDmg += this.currentIterations*this.widgetTable[n].value[1];
                this.workingParam.missileCharge = this.widgetTable[n].value[2];
                break;
            } case powerID.SCALING_DMG: {
                this.currentIterations = this.widgetTable[n].iterations;
                this.checkForward();
                this.workingParam.useScaling = true;
                this.workingParam.scalingAmount = this.currentIterations*this.widgetTable[n].value[0];
                this.workingParam.scalingFactor = this.currentIterations*this.widgetTable[n].value[1];
                break;
            }
            //should only ever hit this IF you begin on a loop
            case powerID.LOOP: {
                this.checkForward();
                break;
            }
        }
    }

    checkForward(){
        if(this.nextWidget == (this.widgetTable.length-1)) {
            this.nextWidget = this.widgetTable.length;
            return;
        }
        let shift = 1;
        for(let i = 1; i < (this.widgetTable.length-this.nextWidget); i++) {
            if (this.widgetTable[this.nextWidget+i].ID == powerID.LOOP) {
                shift++;
                this.currentIterations += this.widgetTable[this.nextWidget+i].value[0];
            } else {
                this.nextWidget += shift;
                return;
            }
        }
        this.nextWidget+=shift;
        
    }

    getColor(index: number): number{
        //LENGTH OF POWERUPLIST
        if((index > 0) && (index <= 25)){
            return this.colorPairs.get(index)!;
        }

        return 11;

    }

    processTable(t: PowerUp[]){
        //only works on length 9 tables
        if(!(t.length == 9))
        {
            return 0;
        }
    }

    calculateBingos(){
        //yanderedev coding
        //rows
        
        this.applyBingo(this.getStackValue(0,1,2));
        this.applyBingo(this.getStackValue(3,4,5));
        this.applyBingo(this.getStackValue(6,7,8));

        //columns
        this.applyBingo(this.getStackValue(0,3,6));
        this.applyBingo(this.getStackValue(1,4,7));
        this.applyBingo(this.getStackValue(2,5,8));

        //diagonals
        this.applyBingo(this.getStackValue(0,4,8));
        this.applyBingo(this.getStackValue(2,4,6));
    }

    getStackValue(n1: number, n2: number, n3: number): number{
        let p = 0;
        if(this.widgetTable[n1] != null) {
            p += this.widgetTable[n1].color;
        } else {
            p += -1;
        }

        if(this.widgetTable[n2] != null) {
            p += this.widgetTable[n1].color;
        } else {
            p += -1;
        }

        if(this.widgetTable[n3] != null) {
            p += this.widgetTable[n1].color;
        } else {
            p += -1;
        }

        return p;
    }

    applyBingo(n: number){
        let i = 0;
        if(n == (pColor.GRAY)|| n == (2*pColor.GRAY) || n == (3*pColor.GRAY)) {
            i = this.currentBingos.get(pColor.GRAY)!;
            i += 1;
            this.currentBingos.set(pColor.GRAY, i);
            return;
        }

        if(n == (pColor.RED)|| n == (2*pColor.RED) || n == (3*pColor.RED)) {
            i = this.currentBingos.get(pColor.RED)!;
            i += 1;
            this.currentBingos.set(pColor.RED, i);
            return;
        }

        if(n == (pColor.BLUE)|| n == (2*pColor.BLUE) || n == (3*pColor.BLUE)) {
            i = this.currentBingos.get(pColor.BLUE)!;
            i += 1;
            this.currentBingos.set(pColor.BLUE, i);
            return;
        }

        if(n == (pColor.GOLD)|| n == (2*pColor.GOLD) || n == (3*pColor.GOLD)) {
            i = this.currentBingos.get(pColor.GOLD)!;
            i += 1;
            this.currentBingos.set(pColor.GOLD, i);
            return;
        }

        if(n == pColor.RAINBOW) {
            i = this.currentBingos.get(pColor.RAINBOW)!;
            i += 1;
            this.currentBingos.set(pColor.RAINBOW, i);
            return;
        }
        
    }

    setBingosByButton(pt: PowerUpButton[]) {
        this.currentBingos = this.calculateBingosByButton(pt);
    }

    calculateBingosByButton(pt: PowerUpButton[]): Map<number, number>{
        //yanderedev coding
        //rows
        let mp = new Map<number, number>();
        
        mp.set(pColor.GRAY, 0);
        mp.set(pColor.RED, 0);
        mp.set(pColor.BLUE, 0);
        mp.set(pColor.GOLD, 0);
        mp.set(pColor.RAINBOW, 0);

        this.applyBingoByButton(this.getStackValueByButton(0,1,2, pt), mp);
        this.applyBingoByButton(this.getStackValueByButton(3,4,5, pt), mp);
        this.applyBingoByButton(this.getStackValueByButton(6,7,8, pt), mp);

        //columns
        this.applyBingoByButton(this.getStackValueByButton(0,3,6, pt), mp);
        this.applyBingoByButton(this.getStackValueByButton(1,4,7, pt), mp);
        this.applyBingoByButton(this.getStackValueByButton(2,5,8, pt), mp);

        //diagonals
        this.applyBingoByButton(this.getStackValueByButton(0,4,8, pt), mp);
        this.applyBingoByButton(this.getStackValueByButton(2,4,6, pt), mp);
        return mp;
    }

    getStackValueByButton(n1: number, n2: number, n3: number, pt: PowerUpButton[]): number{
        let p = 0;
        if(pt[n1] != null) {
            p += pt[n1].color;
        } else {
            p += -1;
        }
        if(pt[n2] != null) {
            p += pt[n2].color;
        } else {
            p += -1;
        }
        if(pt[n3] != null) {
            p += pt[n3].color;
        } else {
            p += -1;
        }

        return p;
    }

    applyBingoByButton(n: number, xt: Map<number, number>){
        let i = 0;
        if(n == (pColor.GRAY)|| n == (2*pColor.GRAY) || n == (3*pColor.GRAY)) {
            i = xt.get(pColor.GRAY)!;
            i += 1;
            xt.set(pColor.GRAY, i);
        }

        if(n == (pColor.RED)|| n == (2*pColor.RED) || n == (3*pColor.RED)) {
            i = xt.get(pColor.RED)!;
            i += 1;
            xt.set(pColor.RED, i);
        }

        if(n == (pColor.BLUE)|| n == (2*pColor.BLUE) || n == (3*pColor.BLUE)) {
            i = xt.get(pColor.BLUE)!;
            i += 1;
            xt.set(pColor.BLUE, i);
        }

        if(n == (pColor.GOLD)|| n == (2*pColor.GOLD) || n == (3*pColor.GOLD)) {
            i = xt.get(pColor.GOLD)!;
            i += 1;
            xt.set(pColor.GOLD, i);
        }

        if(n == pColor.RAINBOW) {
            i = xt.get(pColor.RAINBOW)!;
            i += 1;
            xt.set(pColor.RAINBOW, i);
        }

        return xt;
        
    }


}