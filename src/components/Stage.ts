import { GameScene } from "@/scenes/GameScene";
import { TextEffect } from "./TextEffect";
import { BasicEffect } from "./BasicEffect";
import { Boss } from "./Boss";

interface StageCommand{
	command: string;
	value: number[];
}

export class Stage {
    public scene: GameScene;
    public timer: number = 0;
    public stage_1: StageCommand[]; 
    public stage_2: StageCommand[]; 
    public stageList: StageCommand[][];
    public currentStep: number = 0;
    public pend: boolean = false;
    public currentStage: number = 0;
    private valence: number = 1;

    constructor(scene: GameScene){
        this.scene = scene;
        this.timer = 0;
        this.pend = false;
        this.currentStep = 0;
        this.stage_1 = [
            {command: "wait", value: [1500]},
            //{command: "endStage", value: [1000]},
            //{command: "boss", value: [1500, 540, 6]},
            //{command: "wait", value: [100000000000]},
            //
            {command: "wait", value: [1000]},
            {command: "spawn", value: [3,5]}, 
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [750]}, 
            {command: "spawn", value: [1,0]}, 
            {command: "wait", value: [4500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [5500]}, 
            {command: "spawn", value: [2,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [6500]}, 
            {command: "spawn", value: [3,1]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [3000]}, 
            {command: "spawn", value: [1,0]},    
            {command: "wait", value: [6000]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [3000]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [6500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [2000]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [6000]}, 
            {command: "spawn", value: [3,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [3000]}, 
            {command: "spawn", value: [4,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [8500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [4500]}, 
            {command: "spawn", value: [2,1]},
            {command: "wait", value: [3500]}, 
            {command: "spawn", value: [1,3]},
            {command: "wait", value: [3500]}, 
            {command: "spawn", value: [1,1]},
            {command: "spawn", value: [1,0]},
            {command: "wait_enemies", value: [3000]}, 
            {command: "announce", value: [3000]}, 
            {command: "wait", value: [3500]}, 
            {command: "endStage", value: [1000]},
        ];

        this.stage_2 = [
            {command: "wait", value: [1500]},
            //{command: "endStage", value: [1000]}, 
            {command: "wait", value: [1000]},
            {command: "spawn", value: [3,3]}, 
            {command: "wait", value: [2500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [750]}, 
            {command: "spawn", value: [1,0]}, 
            {command: "wait", value: [4500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [500]}, 
            {command: "spawn", value: [2,0]}, 
            {command: "wait", value: [5500]}, 
            {command: "spawn", value: [2,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [5000]}, 
            {command: "spawn", value: [3,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [2000]}, 
            {command: "spawn", value: [1,0]},    
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [3000]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [2,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [2000]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [6000]}, 
            {command: "spawn", value: [3,1]},
            {command: "wait", value: [500]}, 
            {command: "spawn", value: [1,1]},
            {command: "wait", value: [500]}, 
            {command: "spawn", value: [1,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [4,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [3,0]},
            {command: "wait", value: [1000]}, 
            {command: "spawn", value: [3,3]},
            {command: "wait", value: [10000]}, 
        ];
        this.stageList = [];
        this.stageList.push(this.stage_1);
        this.stageList.push(this.stage_2);
    }

    setCurrentStage(n: number){
        this.currentStage = n;
    }

    update(d: number, t: number) {
        this.parseCommand(d,t);
    }

    parseCommand(d:number, t: number){
        switch (this.stageList[this.currentStage][this.currentStep].command) {
            case "wait": {
                if(this.timer > 0 && this.pend) {
                    this.timer -= d;
                    if(this.timer <= 0) {
                        this.timer = 0;
                        this.pend = false;
                        this.currentStep++;
                        if(this.currentStep >= this.stageList[this.currentStage].length) {
                            this.currentStep = this.stageList[this.currentStage].length-1;
                            this.pend = true;
                        }
                    }
                } else if (this.timer <= 0 && !this.pend) {
                    this.timer = this.stageList[this.currentStage][this.currentStep].value[0];
                    this.pend = true;
                }
                break;
            } case "spawn": {
                if(this.pend) {
                    break;
                }
                this.scene.addEnemies(this.stageList[this.currentStage][this.currentStep].value[0],this.stageList[this.currentStage][this.currentStep].value[1]);
                this.currentStep++;
                if(this.currentStep >= this.stageList[this.currentStage].length) {
                    this.currentStep = this.stageList[this.currentStage].length-1;
                    this.pend = true;
                }
                break;
            }   case "boss": {
                if(this.pend) {
                    break;
                }
                this.scene.addBoss(new Boss(this.scene, this.stageList[this.currentStage][this.currentStep].value[0], this.stageList[this.currentStage][this.currentStep].value[1], 
                    this.stageList[this.currentStage][this.currentStep].value[2]));
                this.currentStep++;
                if(this.currentStep >= this.stageList[this.currentStage].length) {
                    this.currentStep = this.stageList[this.currentStage].length-1;
                    this.pend = true;
                }
                break;
            }   case "announce": {
                if(this.pend) {
                    break;
                }
                this.scene.addTextEffect(new TextEffect(this.scene, 960, 540, "STAGE COMPLETED", "#FF73C5", 175, true, "#DE3163", 3000, 100, 0, 0));
                this.currentStep++;
                if(this.currentStep >= this.stageList[this.currentStage].length) {
                    this.currentStep = this.stageList[this.currentStage].length-1;
                    this.pend = true;
                }
                break;
            }   case "wait_enemies": {
                if(this.timer > 0 && this.pend) {
                    this.timer -= d*this.valence;
                    if(this.timer <= 0) {
                        this.timer = 0;
                        this.pend = false;
                        this.currentStep++;
                        if(this.currentStep >= this.stageList[this.currentStage].length) {
                            this.currentStep = this.stageList[this.currentStage].length-1;
                            this.pend = true;
                        }
                    }
                } else if (this.timer <= 0 && !this.pend) {
                    this.timer = this.stageList[this.currentStage][this.currentStep].value[0];
                    this.valence = 0;
                    this.scene.setWaitEnemies();
                    this.pend = true;
                }
                break;
            }   case "endStage": {
                this.pend = true;
                this.scene.endStage();
                break;
            }
        }
    }



    unStop(){
        this.valence = 1;
    }

    resetTimer(){

    }

}