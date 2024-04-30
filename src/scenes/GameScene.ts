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
	private cutScene: boolean = false;

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
		this.bossList = [];
		this.projectiles = [];
		this.enemyRays = [];
		this.enemyProjectiles = [];
		this.gunEffects = [];
		this.hitEffects = [];
		this.textEffects = [];
		this.background = this.add.image(0, 0, "1-0");
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

		/*
		this.player = new Player(this, this.CX, this.CY);
		this.player.on("action", () => {
			this.player.doABarrelRoll();
		});
		*/

		this.ui = new UI(this);
		this.ui.setDepth(0);
		//this.sound.play("siren");

		this.initTouchControls();
	}

	update(time: number, delta: number) {
		if(this.cutScene) {
			return;
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
		
		//this.player.update(time, delta);
	}

	progressCutscene() {

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

	updateEnemies(d: number, t: number){
		for(let i = (this.enemyList.length-1); i >= 0; i--){
			this.enemyList[i].update(d, t);
			if(this.enemyList[i].deleteFlag){
				this.enemyList[i].destroy();
				this.enemyList.splice(i,1);
			}
		}
		for(let b = (this.bossList.length-1); b >= 0; b--){
			this.bossList[b].update(d, t);
			if(this.bossList[b].deleteFlag){
				this.bossList[b].destroy();
				this.bossList.splice(b,1);
			}
		}
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

	endStage(){
		this.gameData.advanceStage();
		this.stageMusic.stop();
		if(!this.gameData.seenTransition) {
			this.scene.start("TransitionScene", {gameData: this.gameData});
		} else {
			this.scene.start("UpgradeScene", {gameData: this.gameData});
		}
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
