import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Enemy } from "@/components/Enemy";
import { Turret } from "@/components/Turret";
import { Effect } from "@/components/Effect";
import { BasicEffect } from "@/components/BasicEffect";
import { TextEffect } from "@/components/TextEffect";
import { Projectile } from "@/components/Projectile";
import { Stage } from "@/components/Stage";
import { UpgradeScene } from "./UpgradeScene";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Music } from "@/components/Music";
import { EnemyProjectile } from "@/components/EnemyProjectile";
import { Boss } from "@/components/Boss";
import { EnemyRay } from "@/components/EnemyRay";
import { BushEnemy } from "@/components/BushEnemy";

interface TurretPosition{
	x: number;
	y: number;
	targetPriority: number;
}

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Image;
	private player: Player;
	private ui: UI;
	private positions: TurretPosition[];
	private hitEffects: Effect[];
	private gunEffects: Effect[];
	private textEffects: TextEffect[];
	private waveSize: number = 1;
	public enemyList: Enemy[];
	public bushList: BushEnemy[];
	public bossList: Enemy[];
	public timer: number = 3000;
	public activeTurret: Turret;
	//public selectedTurret: number = 0;
	public projectiles: Projectile[];
	public enemyRays: EnemyRay[];
	public enemyProjectiles: EnemyProjectile[];
	public curProjID: number = 0;
	public stageList: Stage;
	public musicStage: Phaser.Sound.WebAudioSound;
	public gameData: GlobalVariables;
	public stageMusic: Phaser.Sound.WebAudioSound;
	private bkgIndex: number = 0;
	private bkgList: string[] = ["1-0", "1-1", "1-2", "1-3"];
	private bkgTimer: number = 500;
	private waitForEnemies: boolean = false;
	private shadowTimer: number = 0;
	public shadowed: boolean = false;
	private clearState: boolean = false;
	private shadowOverlay: Phaser.GameObjects.Graphics;
	public timerData: number[] = [1000, 2500, 2500,2500,2500];
	private blackFade: number = 0;
	private mFade: number[] = [0,0];


	//cutscene control variables
	public cutScene: boolean = false;
	private cutSceneList: string[];
	private overlay3: Phaser.GameObjects.Image;
	private overlay4: Phaser.GameObjects.Image;
	private blk: Phaser.GameObjects.Image;
	private cTimer: number = 0;
	private fTimer: number =0;
	private wTimer: number =0;
	private rTimer: number =0;
	private cutIndex:number = 0;
	private fiTimer: number = 0;
	private foTimer: number = 0;

	public curKills: number = 0;

	private flt: number[] = [0,0];
	private fltDisp: Phaser.GameObjects.Image;
	private sp: boolean = false;
	public spValue: number = 1;

	constructor() {
		super({ key: "GameScene" });
	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.gameData = data.gameData;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.stageList = new Stage(this);
		this.stageList.setCurrentStage(this.gameData.currentStage);
		this.enemyList = [];
		this.bushList = [];
		this.bossList = [];
		this.projectiles = [];
		this.enemyRays = [];
		this.enemyProjectiles = [];
		this.gunEffects = [];
		this.hitEffects = [];
		this.textEffects = [];
		this.bkgList=this.gameData.getStageBkg();
		console.log(this.bkgList);
		this.background = this.add.image(0, 0, this.bkgList[0]);
		this.background.setOrigin(0);
		this.background.setDepth(-4);
		this.fitToScreen(this.background);
		this.overlay = this.add.image(0, 0, "blank_bkg");
		this.overlay.setOrigin(0);
		this.overlay.setDepth(-3);
		this.fitToScreen(this.overlay);
		//this.gameData = new GlobalVariables();
		this.gameData.initializeTurrets(new Turret(this, 286, 663));
		this.activeTurret = this.gameData.myTurrets[this.gameData.selectedTurret];
		this.activeTurret.resetScene(this);
		this.activeTurret.place();
		this.activeTurret.updateParams();
		this.stageMusic = new Music(this, this.gameData.getStageMusic(), { volume: 0.4 });
		this.stageMusic.play();
		this.overlay3 = this.add.image(0,0,"blank_bkg");
		this.overlay4 = this.add.image(0,0,"blank_bkg");
		this.overlay3.setOrigin(0);
		this.overlay4.setOrigin(0);
		this.add.existing(this.overlay3);
		this.add.existing(this.overlay4);
		this.overlay3.setDepth(16);
		this.overlay4.setDepth(17);
		this.cutSceneList = [];
		this.shadowOverlay = this.add.graphics();
		this.add.existing(this.shadowOverlay);
		this.shadowOverlay.setDepth(15);
		this.shadowTimer = 0;
		this.fltDisp = this.add.image(0,0,"white_bkg");
		this.fitToScreen(this.fltDisp);
		this.fltDisp.setOrigin(0,0);
		this.fltDisp.setVisible(false);
		this.fltDisp.setDepth(18);
		this.add.existing(this.fltDisp);
		this.blk = this.add.image(0, 0, "black_bkg");
		this.blk.setOrigin(0);
		this.blk.setVisible(false);
		this.blk.setDepth(19);
		this.fitToScreen(this.blk);
		this.add.existing(this.blk);

		/*
		this.player = new Player(this, this.CX, this.CY);
		this.player.on("action", () => {
			this.player.doABarrelRoll();
		});
		*/

		this.ui = new UI(this);
		this.ui.setDepth(-3);
		this.ui.setAlpha(0.8);
		//this.sound.play("siren");
		this.curKills = 0;
		this.initTouchControls();
	}



	setCutScene(scenes: string[], timers: number[] = [1000,2500,1000,0,0], specialMusic: boolean = false) {
		this.cutSceneList = scenes;
		this.cutScene = true;
		this.cutIndex = 0;
		this.timerData = timers;
		this.sp = specialMusic;
		if(timers[4] > 0) {
			this.fiTimer = timers[3]; 
			//this.overlay3.setTexture("white_bkg");
			this.overlay4.setTexture("white_bkg");
		} else {
			this.fTimer = this.timerData[0];
			this.overlay4.setTexture(this.cutSceneList[0]);
		}
		this.overlay3.setVisible(true);
		this.overlay4.setVisible(true);
		this.overlay4.setAlpha(0);
		this.fitToScreen(this.overlay3);
		this.fitToScreen(this.overlay4);
	}

	fadeBlack() {
		this.blackFade = 5000;
		this.blk.setAlpha(0);
		this.blk.setVisible(true);
	}

	update(time: number, delta: number) {
		if(this.mFade[0] > 0) {
			this.mFade[0] -= delta;
			if(this.mFade[0] <= 0) {
				this.stageMusic.stop();
				this.mFade = [0,0];
			} else {
				this.stageMusic.setVolume(0.4*this.mFade[0]/this.mFade[1]);
			}
		}
		if(this.blackFade > 0) {
			this.blackFade -= delta;
			if(this.blackFade<=0){
				this.blk.setAlpha(1);
				this.endGame();
			} else {
				this.blk.setAlpha(1-(this.blackFade/5000));
			}
			return;
		}
		if(this.cutScene) {
			this.processCutscene(delta);
			return;
		}

		if(this.flt[0] > 0) {
			this.flt[0] -= delta;
			if(this.flt[0] <= 0) {
				this.flt[0] = 0;
				this.fltDisp.setAlpha(0);
				this.fltDisp.setVisible(false);
				this.flt = [0,0];
			} else {
				this.fltDisp.setAlpha(this.flt[0]/this.flt[1]);
			}
		}

		if(this.bkgTimer > 0) {
			this.bkgTimer-= delta;
			this.overlay.setAlpha(this.bkgTimer/7000);
			if(this.bkgTimer <= 0) {
				this.overlay.setAlpha(0);
				this.scrollBkg();
			}
		}

		this.ui.update(time, delta);
		/*
		if(this.timer > 0) {
			this.timer -= delta;
		}
		
		if(this.timer <= 0){
			this.addEnemies();
			//this.sound.play("siren");
			this.timer = 500+(Math.random()*500);
		}
		*/

		this.updateStage(delta, time);
		this.updateTurrets(delta);
		this.updateProjectiles(delta, time);
		this.updateEnemies(delta, time);
		this.updateEffects(delta, time);
		if(this.shadowed) {
			if(this.shadowTimer > 0) {
				this.shadowTimer -= delta;	
				if(this.shadowTimer <= 0) {
					this.shadowTimer = 0;
					this.shadowOverlay.clear();
					this.shadowOverlay.fillStyle(0x000000, 0.5);
					this.shadowOverlay.beginPath();
					this.shadowOverlay.arc(960,540,2250,0,360,false,0.001);
					this.shadowOverlay.closePath();
					this.shadowOverlay.fillPath();
				} else {
					this.shadowOverlay.clear();
					this.shadowOverlay.fillStyle(0x000000, 0.5);
					this.shadowOverlay.beginPath();
					this.shadowOverlay.arc(960,540,2250*(1-(this.shadowTimer/250)),0,360,false,0.001);
					this.shadowOverlay.closePath();
					this.shadowOverlay.fillPath();
				}
			}
		} else if(!this.shadowed) {
			if(this.shadowTimer > 0) {
				this.shadowTimer -= delta;
				if(this.shadowTimer <= 0) {
					this.shadowTimer = 0;					
					this.shadowOverlay.clear();
				} else {
					this.shadowOverlay.clear();
					this.shadowOverlay.fillStyle(0x000000, 0.5);
					this.shadowOverlay.beginPath();
					this.shadowOverlay.arc(960,540,2250*(this.shadowTimer/250),0,360,false,0.001);
					this.shadowOverlay.closePath();
					this.shadowOverlay.fillPath();
				}

			}
		}
		
		//this.player.update(time, delta);
	}

	processCutscene(delta: number) {
		if(this.fiTimer > 0) {
			this.fiTimer -= delta;
			if(this.fiTimer <= 0) {
				this.fiTimer = 0;
				this.fTimer = this.timerData[0];

				this.overlay3.setTexture("white_bkg");
				this.overlay3.setAlpha(1);
				this.overlay3.setVisible(true);
				this.resetBackground(["fr0","fr1","fr2","fr3","fr4","fr5","fr6","fr7","fr8"]);
				this.overlay4.setTexture(this.cutSceneList[0]);
				this.overlay4.setAlpha(0);
				if(this.sp) {
					this.swapMusic(1);
					this.sp = false;
				}
			} else {
				this.overlay4.setAlpha(1-(this.fiTimer/this.timerData[3]));
			}
		}
		if(this.fTimer > 0) {
			this.fTimer -= delta;
			if(this.fTimer <= 0) {
				this.fTimer = 0;
				this.wTimer = this.timerData[1];
				this.overlay3.setTexture(this.cutSceneList[0]);
				this.overlay3.setAlpha(1);
				this.overlay4.setTexture("blank_bkg");
				this.overlay4.setVisible(false);
				this.overlay4.setAlpha(1);
			} else {
				this.overlay4.setAlpha(1-(this.fTimer/this.timerData[0]));
			}

		}

		if(this.wTimer > 0) {
			this.wTimer -= delta;
			if(this.wTimer <= 0) {
				this.wTimer = 0;
				this.overlay4.setTexture(this.cutSceneList[this.cutIndex]);
				this.overlay4.setAlpha(1);
				this.overlay4.setVisible(true);
				this.cutIndex++;
				if(this.cutIndex >= this.cutSceneList.length) {
					this.overlay3.setAlpha(1);
					if(this.timerData[4] > 0) {
						this.overlay4.setTexture("white_bkg");
						this.overlay4.setAlpha(0);
						this.overlay4.setVisible(true);
						this.foTimer = this.timerData[4];
					} else { 
						this.rTimer = this.timerData[0]; 
						this.overlay3.setVisible(false);
						this.overlay3.setAlpha(0);
						this.overlay3.setTexture("blank_bkg");
					}
				} else {
					this.overlay3.setTexture(this.cutSceneList[this.cutIndex]);
					this.overlay3.setAlpha(1);
					this.overlay3.setVisible(true);
					this.fitToScreen(this.overlay3);
					this.fitToScreen(this.overlay4);
					this.cTimer = this.timerData[2];
				}
			}
		}
		if(this.cTimer > 0) {
			this.cTimer -= delta;
			if(this.cTimer <= 0) {
				this.cTimer = 0;
				this.wTimer = this.timerData[1];
				this.overlay4.setVisible(false);
				this.overlay4.setTexture("blank_bkg");
			} else {
				this.overlay4.setAlpha(this.cTimer/this.timerData[2]);
			}
		}
		if(this.rTimer > 0) {
			this.rTimer -= delta;
			if(this.rTimer <= 0){
				this.cutScene = false;
				this.overlay3.setTexture("blank_bkg");
				this.overlay3.setVisible(false);
				this.overlay4.setTexture("blank_bkg");
				this.overlay4.setVisible(false);
				this.cTimer = 0;
				this.fTimer = 0;
				this.wTimer = 0;
				this.rTimer = 0;
				this.fiTimer = 0;
				this.foTimer = 0;
			} else {
				this.overlay4.setAlpha(this.rTimer/this.timerData[0]);
			}
		}

		if(this.foTimer > 0) {
			this.foTimer -= delta;
			if(this.foTimer <= 0) {
				this.cutScene = false;
				this.setFlash(4000);
				this.overlay3.setTexture("blank_bkg");
				this.overlay3.setVisible(false);
				this.overlay4.setTexture("blank_bkg");
				this.overlay4.setVisible(false);
				this.cTimer = 0;
				this.fTimer = 0;
				this.wTimer = 0;
				this.rTimer = 0;
				this.fiTimer = 0;
				this.foTimer = 0;
			} else {
				this.overlay4.setAlpha(1-(this.foTimer/this.timerData[4]));
			}
		}
	}

	shadow(){
		this.sound.play("shadow",{volume:2.5});
		this.shadowed = true;
		this.shadowTimer = 250;
	}

	unshadow(){
		if(this.shadowed) {
			this.sound.play("unshadow");
			this.shadowed = false;
			this.shadowTimer = 250;
		}
	}
	resetBackground(arg: string[]){
		this.bkgList=arg;
		this.background.setTexture(this.bkgList[0])
		this.bkgIndex = 0;
		this.overlay.setTexture("blank_bkg");
		this.bkgTimer = 20000;

	}
	scrollBkg() {
		if(this.bkgIndex < (this.bkgList.length)) {

			if(this.bkgIndex == (this.bkgList.length-1)) {
				this.bkgIndex = 0;
				this.background.setTexture(this.bkgList[0]);
				this.overlay.setTexture(this.bkgList[this.bkgList.length-1]);
				this.overlay.setAlpha(1);
				this.bkgTimer = 20000;
			} else {
				this.bkgIndex++;
				this.background.setTexture(this.bkgList[this.bkgIndex]);
				this.overlay.setTexture(this.bkgList[this.bkgIndex-1]);
				this.overlay.setAlpha(1);
				this.bkgTimer = 20000;
			}

        }
	}
	
	despawnEnemies(){
		/*
		for(let i = (this.enemyList.length-1); i >= 0; i--){
			this.enemyList[i].erase();
		}
		*/
		console.log("STARTING ERASE: " + this.enemyList);
		for(let i = 0; i < this.enemyList.length; i++) {
			console.log("ERASING: " + this.enemyList[i].erase());
		}

		this.clearState = true;
		for(let b = 0; b < this.bushList.length; b++){
			console.log("ERASING BUSH: " + this.bushList[b].erase());
		}
	}

	despawnProjectiles(){
		for(let er = this.enemyRays.length-1; er >= 0; er--) {
			this.enemyRays[er].erase();
		}

		for(let ep = this.enemyProjectiles.length-1; ep >= 0; ep--) {
			this.enemyProjectiles[ep].erase();
		}
	}

	addEnemies(n: number, type: number){
		this.waveSize = n;
		for(let i = 0; i < this.waveSize; i++){

			this.enemyList.push(new Enemy(this,2280,(100+(Math.trunc(Math.random()*681))),type));
		}
	}

	addEnemiesFromBack(n: number, type: number, position: number[]){
		this.waveSize = n;
		for(let i = 0; i < this.waveSize; i++){

			this.enemyList.push(new Enemy(this,2280,(position[0]+(Math.trunc(Math.random()*(position[1]-position[0])))),type));
		}
	}

	pushEnemy(e: Enemy) {
		this.enemyList.push(e);
	}

	pushBush(b: BushEnemy) {
		this.bushList.push(b);
	}

	updateStage(d: number, t: number) {
		this.stageList.update(d, t);
		if(this.waitForEnemies) {
			if((this.enemyList.length <= 0) && (this.bossList.length <= 0)) {
				this.stageList.unStop();
				this.waitForEnemies = false;
			}
		}
	}

	updateTurrets(d: number){
		this.activeTurret.update(d);
	}

	updateProjectiles(d: number, t: number) {
		for(let p = this.projectiles.length-1; p >= 0; p--) {
			this.projectiles[p].update(d);
			for(let e = this.enemyList.length-1; e >= 0; e--) {
				this.projectiles[p].collide(this.enemyList[e]);
			}
			for(let b = this.bossList.length-1; b >= 0; b--) {
				this.projectiles[p].collide(this.bossList[b]);
			}
			this.projectiles[p].handleCollisionEffects();
			if(this.projectiles[p].deleteFlag){
				this.projectiles[p].destroy();
				this.projectiles.splice(p,1);
			}
		}

		for(let er = this.enemyRays.length-1; er >= 0; er--) {
			this.enemyRays[er].update(d,t);
			if(this.enemyRays[er].deleteFlag){
				this.enemyRays[er].destroy();
				this.enemyRays.splice(er,1);
			}
		}

		for(let ep = this.enemyProjectiles.length-1; ep >= 0; ep--) {
			this.enemyProjectiles[ep].update(d);
			this.enemyProjectiles[ep].collide(this.activeTurret);
			this.enemyProjectiles[ep].handleCollisionEffects();
			if(this.enemyProjectiles[ep].deleteFlag){
				this.enemyProjectiles[ep].destroy();
				this.enemyProjectiles.splice(ep,1);
			}
		}
		
	}

	customProjUpdate(e: Enemy, r: number) {
		for(let ep = this.enemyProjectiles.length-1; ep >= 0; ep--) {
			this.enemyProjectiles[ep].tCollide(e, r);
			if(this.enemyProjectiles[ep].deleteFlag){
				this.enemyProjectiles[ep].destroy();
				this.enemyProjectiles.splice(ep,1);
			}
		}
	}

	updateEnemies(d: number, t: number){
		for(let i = (this.enemyList.length-1); i >= 0; i--){
			this.enemyList[i].update(d, t);
			if(this.enemyList[i].deleteFlag){
				this.enemyList[i].destroy();
				this.enemyList.splice(i,1);
			}
		}

		for(let bs = (this.bushList.length-1); bs >= 0; bs--){
			this.bushList[bs].update(d, t);
			if(this.clearState) {
				this.bushList[bs].erase();	
			}
			if(this.bushList[bs].deleteFlag){
				this.bushList[bs].destroy();
				this.bushList.splice(bs,1);
			}
		}

		for(let b = (this.bossList.length-1); b >= 0; b--){
			this.bossList[b].update(d, t);
			if(this.bossList[b].deleteFlag){
				this.bossList[b].destroy();
				this.bossList.splice(b,1);
			}
		}
		this.clearState = false;
	}

	setFlash(n:number) {
		this.flt=[n,n];
		this.fltDisp.setAlpha(1);
		this.fltDisp.setVisible(true);
	}

	fadeMusic(n:number){
		this.mFade = [n,n];
	}

	swapMusic(k:number){
		this.stageMusic = new Music(this, this.gameData.getMusic(k), { volume: 0.4 });
		this.stageMusic.play();
	}

	addGunEffect(b: Effect){
		this.gunEffects.push(b);
	}

	addHitEffect(b: Effect){
		this.gunEffects.push(b);
	}

	updateEffects(d: number, t: number){
		for(let g = (this.gunEffects.length-1); g >= 0; g--){
			if(this.gunEffects[g] == null) {
				console.log("NULL INSTANCE EFFECT");
				return;
			}
			this.gunEffects[g].update(d, t);
			if(this.gunEffects[g].deleteFlag) {
				this.gunEffects[g].destroy();
				this.gunEffects.splice(g,1);
			}
		}

		for(let h = (this.hitEffects.length-1); h >= 0; h--){
			this.hitEffects[h].update(d, t);
			if(this.hitEffects[h].deleteFlag) {
				this.hitEffects[h].destroy();
				this.hitEffects.splice(h,1);
			}
		}

		for(let tx = (this.textEffects.length-1); tx >= 0; tx--){
			this.textEffects[tx].update(d, t);
			if(this.textEffects[tx].deleteFlag) {
				this.textEffects[tx].destroy();
				this.textEffects.splice(tx,1);
			}
		}
	}

	addTextEffect(t: TextEffect) {
		this.textEffects.push(t);
	}

	addProjectile(p: Projectile){
		this.projectiles.push(p);

	}

	addEnemyRay(l: EnemyRay) {
		this.enemyRays.push(l);
	}

	addEnemyProjectile(p: EnemyProjectile){
		this.enemyProjectiles.push(p);
	}

	getProjID(): number{
		this.curProjID++;
		if(this.curProjID > 999999999) {
			this.curProjID = 0;
		}
		return this.curProjID;
	}

	dropWidget(){
		
	}

	setReqWidget(n: number){
		this.gameData.nextReqWidget = n;
	}

	trackEnemyKill(){
		this.curKills++;
		this.gameData.updateKills(1);
	}

	endStage(){
		//this.gameData.restoreAllLives(); not needed since restored in turret when calculating bingos
		this.activeTurret.health = this.activeTurret.maxHealth;
		this.gameData.advanceStage();
		this.stageMusic.stop();
		if(!this.gameData.seenTransition) {
			this.scene.start("TransitionScene", {gameData: this.gameData});
		} else {
			this.scene.start("UpgradeScene", {gameData: this.gameData});
		}
	}

	endGame(){
		this.gameData.advanceStage();
		this.stageMusic.stop();
		this.scene.start("EndScene", {gameData: this.gameData});
	}

	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			/*
			if (!this.player.isTouched) {
				this.player.touchStart(pointer.x, pointer.y);
				touchId = pointer.id;
				touchButton = pointer.button;
			}
			else if (this.player.isTouched && !this.player.isTapped) { // Use second touch point as a trigger
				this.player.doABarrelRoll();
			}
			*/
			if(this.activeTurret != null) {
				this.activeTurret.fire();
			}
		});

		/*
		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

			if (touchId == pointer.id) {
				this.player.touchDrag(pointer.x, pointer.y);
			}

		});
		*/

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			/*
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				this.player.touchEnd(pointer.x, pointer.y);
			} 
			*/
			if(this.activeTurret != null) {
				this.activeTurret.unfire();
			}
		});
	}

	addBoss(b: Boss){
		this.bossList.push(b);
	}

	setWaitEnemies(){
		this.waitForEnemies = true;
	}
}
