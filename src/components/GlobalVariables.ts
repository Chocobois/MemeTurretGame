import { PowerUp } from "./PowerUp";
import { pColor } from "./PowerUp";
import { powerID} from "./PowerUpHandler";
import { Turret } from "./Turret";
import { PowerUpButton } from "./PowerUpButton";
import { MusicKey } from "./MusicData";
import { BossCommand } from "./BossCommand";

export class GlobalVariables{
    public myWidgets: number[][];
    public myTurrets: Turret[];
    public selectedTurret: number;
    public turretsInitialized: boolean = false;
    public currentStage: number = 0;
    public stageMusic: MusicKey[] = ["m_st1", "m_boss0","m_st1" ];
    public mList: MusicKey[] = ["m_final2","m_final3", "m_st2", "m_st1", "m_boss0", "m_boss1"];
    public endM: MusicKey = "m_end";

    public bkgLists: string[][] = [["1-0", "1-1", "1-2", "1-3"], ["st0", "st1", "st2", "st3", "st4"]]
    private maxStages: number = 1;
    public seenTransition: boolean = false;
    public gold: number = 0;
    public scaling: number = 1.05;
    public scoreTracker: number = 0;
    public scoreThreshold: number = 1000000;
    public goldBonus: number = 0;
    public lives: number = 3;
    public maxLives: number = 3;
    public extraMaxLives: number = 0;
    public failState: boolean = false;
    public boss_script_0: BossCommand[];
    public boss_script_1: BossCommand[];
    private widgetDropTable: number [][] =
[
    //null
    [999, 100],
    //plain
    [0, 6],
    [6, 13],
    [13, 20],
    [20, 27],
    [27, 35],
    //gray
    [35, 37],
    [37, 40],
    [40, 44],
    [44, 47],
    //red
    [47, 48.5],
    [48.5, 50],
    [50, 53],
    [53, 57],
    //blue
    [57, 60.5],
    [60.5, 64],
    [64, 65.5],
    [65.5, 67],
    //gold
    [67, 69],
    [69, 71],
    [71, 75],
    [75, 77],
    //rainbow
    [77, 77.5],
    [77.5, 78.5],
    [78.5, 80],
    //scaling widget (doesn't drop)
    [999, 100],
]
    
    constructor(){
        //ID, owned, used
        this.myWidgets = [[0,1,0],[1,2,0],[2,2,0],[3,2,0],[4,2,0],[5,2,0],[6,4,0],[7,2,0],[8,2,0],[9,3,0],[10,2,0],[11,3,0],[12,3,0],
        [13,3,0],[14,8,0],[15,3,0],[16,3,0],[17,3,0],[18,4,0],[19,4,0],[20,5,0],[21,5,0],[22,5,0],[23,5,0],[24,3,0],[25,1,0]];

        this.myTurrets = [];
        this.selectedTurret = -1;


        
    }

    public addGold(g: number): number {
        let gd = (g+this.goldBonus);
        this.gold += gd;
        return gd;
    }

    public scaleScore(n: number) {
        this.scoreTracker += n;
        if(this.scoreTracker >= this.scoreThreshold) {
            this.scoreTracker -= this.scoreThreshold;
            this.scaling += 0.05;
        }
    }

    public getStageMusic(): MusicKey {
        return this.stageMusic[this.currentStage];
    }

    public getStageBkg(): string[]{
       if(this.currentStage < this.bkgLists.length) {
            return this.bkgLists[this.currentStage];
       } else {
            return this.bkgLists[0];
       }
    }

    public getEndMusic(): MusicKey {
        return this.endM;
    }

    public getMusic(n: number): MusicKey {
        if(n < this.mList.length) {
            return this.mList[n];
        } else{
            return this.mList[0];
        }

    }

    public advanceStage(){
        this.currentStage++;
        if(this.currentStage > this.maxStages){
            this.currentStage = this.maxStages;
        }
    }

    public initializeTurrets(t: Turret){
        if(!this.turretsInitialized){
            this.myTurrets.push(t);
            this.selectedTurret = 0;
            this.turretsInitialized = true;
            console.log("Turrets initialized");
        }
    }

    public addTurret(t: Turret){
        this.myTurrets.push(t);
    }

    public applyTable(p: PowerUpButton[]){
        if(this.noTurrets()){
            console.log("No turrets to apply table");
            return;
        }
        this.myTurrets[this.selectedTurret].processButtonTable(p);
    }

    public noTurrets(): boolean{
        if(this.myTurrets.length <= 0){
            return true;
        }
        return false;
    }

    public loseLife(){
        if(this.lives > 0) {
            this.lives--;
            if(this.lives <= 0) {
                this.failState = true;
            }
        }
    }

    public restoreAllLives(){
        this.lives = this.maxLives;
    }

    public addWidget(index: number){
        if((index > 0) && (index < this.myWidgets.length))
        {
            this.myWidgets[index][1] += 1;
        }
    }

    public removeWidget(index: number){
        if((index > 0) && (index < this.myWidgets.length))
        {
            this.myWidgets[index][1] -= 1;
        }
    }

    public takeWidget(index: number){
        if((index > 0) && (index < this.myWidgets.length))
        {
            this.myWidgets[index][2] += 1;
        }
    }

    public returnWidget(index: number){
        if((index > 0) && (index < this.myWidgets.length))
        {
            this.myWidgets[index][2] -= 1;
        }
    }

    public dropRandomWidget() {
        let c = Math.random()*80;
        for(let cn = 0; cn < this.widgetDropTable.length; cn++) {
            if((c >= this.widgetDropTable[cn][0]) && (c < this.widgetDropTable[cn][1])) {
                this.addWidget(cn);
                return;
            }
        }
    }

}