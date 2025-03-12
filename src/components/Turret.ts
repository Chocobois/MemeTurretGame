import { GameScene } from "@/scenes/GameScene";
import { Projectile, ProjectileParams } from "./Projectile";
import { BasicEffect } from "./BasicEffect";
import { PowerUp, pColor } from "./PowerUp";
import { PowerUpButton } from "./PowerUpButton";
import { PowerUpHandler, powerID } from "./PowerUpHandler";
import { TurretParams } from "./PowerUpHandler";
import { TurretModel } from "./TurretModel";



export class Turret{
	public scene: GameScene;
	// Sprites
	private spriteSize: number;
	private baseSprite: Phaser.GameObjects.Sprite;
    private gunSprite: Phaser.GameObjects.Sprite;
	private tween: Phaser.Tweens.Tween;
	private keys: any;

	// Controls
	private keyboard: any;
	public isTouched: boolean;
	public isTapped: boolean;
	private tappedTimer: number;
	private inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	private touchPos: Phaser.Math.Vector2;
	public velocity: Phaser.Math.Vector2;
	private border: { [key: string]: number };
    private cooldown: number = 0;
    private rof: number = 1;
    public firing: boolean = false;
    private curAngle: number = 0;
    private baseProjectileDamage: number = 10;
	public powerUpInfo: PowerUpHandler;
	public defaultParams: TurretParams;
	public defaultProjectileData: ProjectileParams;
	public workingProjectileData: ProjectileParams;
	public workingParams: TurretParams;
	public turretDisplay: TurretModel;
	public updated: boolean = false;
	public x: number;
	public y: number;
	public shotCount: number = 0;
	public base: string = "turretbase";
	public gunDistance: number = 128;
	private burstCounter: number = 0;
	private burstCD: number = 20;
    public health: number = 1000;
	public maxHealth: number = 1000;
	public radius: number = 100;
	public vel: number = 600;
	public danmaku: boolean = false;
	public fMove: number = 0;

	constructor(scene: GameScene, x: number, y: number) {
        this.scene = scene;
        this.cooldown = 0;
        this.rof = 2.5;
		this.x = x;
		this.y = y;
		this.powerUpInfo = new PowerUpHandler(this.scene);
		this.turretDisplay = new TurretModel(scene,x,y,this);
		this.defaultParams = {
            baseDamage: 18,
            critChance: 0, critDmg: 2.5, critMod: 1,
            rof: 1.5, acc: 0,
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
		this.defaultProjectileData = {
			velocity: 2400,
			radius: 10,
			pID: -1,
			duration: 10000,
			gravity: false,
			modifier: 1,
			isMissile: false,
			sprite: "bullet_1",
			onHitDisabled: false,
			critDisabled: false,
		}
		this.workingParams = this.cloneTurretData(this.defaultParams);
		this.workingProjectileData = this.defaultProjectileData;
		this.keys = scene.input.keyboard?.addKeys({
			up: 'W',		up2: 'Up',
			down: 'S',		down2: 'Down',
			left: 'A',		left2: 'Left',
			right: 'D',		right2: 'Right',
			shift: 'Shift',
		});
	}

	update(d: number) {
		const pointer = this.scene.input.activePointer;
		if(this.danmaku) {
			this.processVelocity(this.handleInput(), d);
		}
		if(this.fMove > 0) {
			this.fMove -= d;
			this.y-=(d/1000)*1000;
		}
        this.curAngle = Math.atan2((pointer.y-this.y),(pointer.x-this.x));
		this.turretDisplay.update(d, this.curAngle);
		if(this.health <= 0) {
			this.scene.gameData.loseLife();
			this.scene.sound.play("turret_dead", {volume:0.2});
			this.health = this.maxHealth;
		}
		this.turretDisplay.updateHPDisplay(this.health, this.maxHealth);
        if(this.cooldown > 0) {
            this.cooldown -= d;
        }
        if(this.cooldown <= 0) {

            if(this.firing) {
				if(this.workingParams.burst && (this.burstCounter == 0)) {
					this.burstCounter = this.workingParams.burstAmount;
				}
                this.shoot(this.curAngle);
				if(this.workingParams.burst && (this.burstCounter > 0))
				{
					this.burstCounter--;
					if(this.burstCounter <= 0) {
						this.cooldown = Math.round(1000/(this.rof*this.workingParams.rof));
					} else {
						this.cooldown = 20+Math.round(0.1*1000/(this.rof*this.workingParams.rof));
					}
				} else {
              		this.cooldown = Math.round(1000/(this.rof*this.workingParams.rof));
				}
			// repeated if testing for all these params because I would like to fire bursts on the same tick as the cooldown elapses, but also finish bursts when the firing button is unpressed

            } else if (this.workingParams.burst && (this.burstCounter > 0)) {
				this.shoot(this.curAngle);
				this.burstCounter--;
				if(this.burstCounter <= 0) {
					this.cooldown = Math.round(1000/(this.rof*this.workingParams.rof));
				} else {
					this.cooldown = 20+Math.round(0.1*1000/(this.rof*this.workingParams.rof));
				}
				
			}
        }
		// Animation (Change to this.sprite.setScale if needed)
		//const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		//this.setScale(1.0, squish);
	}

    shoot(angle: number){
		if(this.workingParams.missiles){
			if(this.shotCount > 0) {
				this.shotCount--;
			}
			if(this.shotCount <= 0) {
				this.shootMissiles(angle);
				this.shotCount = this.workingParams.missileCharge;
			}
		}
        let na = angle + ((-1*this.workingParams.acc+(Math.random()*2*this.workingParams.acc))*(Math.PI/180));
        let nx = Math.cos(angle)*this.gunDistance;
        let ny = Math.sin(angle)*this.gunDistance;
        this.scene.sound.play("machinegun", {volume:0.25});
		let wps = {
			velocity: this.defaultProjectileData.velocity*this.workingParams.pspeed,
			radius: this.defaultProjectileData.radius,
			pID: this.scene.getProjID(),
			duration: this.defaultProjectileData.duration,
			gravity: false,
			modifier: this.defaultProjectileData.modifier,
			isMissile: false,
			sprite: "bullet_1",
			onHitDisabled: false,
			critDisabled: false,
		}
        this.scene.addGunEffect(new BasicEffect(this.scene, "flash", this.x+nx, this.y+ny, 2, 50, false, 0, angle));
        this.scene.addProjectile(new Projectile(this.scene, this.x+nx, this.y+ny, na, this.cloneProjectileData(wps), this.cloneTurretData(this.workingParams)));
		if(this.workingParams.shotgun) {
			wps.modifier = this.workingParams.shotgunDmg;
			let mod = 0;
			for(let su = 1; su <= (Math.trunc(this.workingParams.shotgunPellets/2)); su++){
				mod = na+(su*3.5*(Math.PI/180));
				this.workingProjectileData.pID = this.scene.getProjID();
				this.scene.addProjectile(new Projectile(this.scene, this.x+nx, this.y+ny, mod, this.cloneProjectileData(wps), this.cloneTurretData(this.workingParams)));
			}
			for(let sd = 1; sd <= (Math.trunc(this.workingParams.shotgunPellets/2)); sd++){
				mod = na-(sd*3.5*(Math.PI/180));
				this.workingProjectileData.pID = this.scene.getProjID();
				this.scene.addProjectile(new Projectile(this.scene, this.x+nx, this.y+ny, mod,  this.cloneProjectileData(wps), this.cloneTurretData(this.workingParams)));
			}
		}

        /*

        this.scene.addProjectile(new Projectile(this.scene, this.x+(128*nx), this.y+(128*ny), 2400, na, 10, this.processDamage(), this.scene.curProjID));
        na = angle-(5*(Math.PI/180));
        nx = Math.cos(angle);
        ny = Math.sin(angle);
        this.scene.addProjectile(new Projectile(this.scene, this.x+(128*nx), this.y+(128*ny), 2400, na, 10, this.processDamage(), this.scene.curProjID));
        */
    }

	shootMissiles(angle: number){
		let lm = angle;
		let lx = Math.cos(angle);
		let ly = Math.sin(angle);
		this.scene.sound.play("missile_sound", {volume:0.25});
		let wp = {
			velocity: this.defaultProjectileData.velocity*(0.85+(Math.random()*(0.6)))*this.workingParams.pspeed,
			radius: this.defaultProjectileData.radius,
			pID: this.scene.getProjID(),
			duration: this.defaultProjectileData.duration,
			gravity: false,
			modifier: this.defaultProjectileData.modifier,
			isMissile: true,
			sprite: "missile",
			onHitDisabled: false,
			critDisabled: true,
		}

		let wx = this.cloneTurretData(this.workingParams);
		wx.canPierce = false;
		wx.flak = false;
		wx.canExplode = false;

		for(let sr = 1; sr <= this.workingParams.missileCount; sr++){
			lm = angle + ((-10+(Math.random()*20))*Math.PI/180);
			this.workingProjectileData.pID = this.scene.getProjID();
			this.scene.addProjectile(new Projectile(this.scene, this.x+(128*lx), this.y+(128*ly), lm,  this.cloneProjectileData(wp), this.cloneTurretData(wx)));
			wp.velocity = this.defaultProjectileData.velocity*(0.85+(Math.random()*(0.6)))*this.workingParams.pspeed;
		}
	}

	cloneProjectileData(p: ProjectileParams): ProjectileParams{
		return {
			velocity: p.velocity,
			radius: p.radius,
			pID: this.scene.getProjID(),
			duration: p.duration,
			gravity: p.gravity,
			modifier: p.modifier,
			isMissile: p.isMissile,
			sprite: p.sprite,
			onHitDisabled: p.onHitDisabled,
			critDisabled: p.critDisabled,
		}
	}

	cloneTurretData(t: TurretParams): TurretParams{
		return {
            baseDamage: t.baseDamage,
            critChance: t.critChance, critDmg: t.critDmg, critMod: t.critMod,
            rof: t.rof, acc: t.acc,
            shotgun: t.shotgun, shotgunPellets: t.shotgunPellets, shotgunDmg: t.shotgunDmg,
            pspeed: t.pspeed,
            onHit: t.onHit,
            chainCrit: t.chainCrit,
            percentPen: t.percentPen, flatPen: t.flatPen,
            slow: t.slow,
            canPierce: t.canPierce, pierceCount: t.pierceCount, pierceTimer: t.pierceTimer, pierceMod: t.pierceMod,
            canExplode: t.canExplode, explRad: t.explRad, explDmg: t.explDmg, explCount: t.explCount,
            flatGold: t.flatGold, onHitGold: t.onHitGold,
            canSmite: t.canSmite, smitePercent: t.smitePercent,
            missiles: t.missiles, missileCount: t.missileCount, missileDmg: t.missileDmg, missileCharge: t.missileCharge,
            useScaling: t.useScaling, scalingFactor: t.scalingFactor, scalingAmount: t.scalingAmount,
			flak: t.flak, flakAmount: t.flakAmount, flakPierce: t.flakPierce,
			burst: t.burst, burstAmount: t.burstAmount,
			onhitchain: t.onhitchain, onhitchainchance: t.onhitchainchance,
        };
	}
	
	processButtonTable(p: PowerUpButton[]){
		this.powerUpInfo.boardToPowerUpList(p);
		this.powerUpInfo.setBingosByButton(p);
	}

	updateParams(){
		this.workingParams = this.powerUpInfo.processPowerUps(this.cloneTurretData(this.defaultParams));
		this.scene.gameData.goldBonus = this.workingParams.flatGold;
		this.applyBingosToParams();
		this.updated = true;
		console.log(this.workingParams);
		
	}

	applyBingosToParams(){
		let v = 0;
		v = this.powerUpInfo.currentBingos.get(pColor.GRAY)!;
		if(v > 0)
		{
			this.workingParams.burst = true;
			this.workingParams.burstAmount += v;
		}
		v = this.powerUpInfo.currentBingos.get(pColor.RED)!;
		if(v > 0) {
			this.workingParams.critDmg += (0.3*v);
		}
		v = this.powerUpInfo.currentBingos.get(pColor.BLUE)!;
		if(v > 0) {
			this.workingParams.flak = true;
			this.workingParams.flakAmount += (1+(2*v));
			this.workingParams.flakPierce = 3;
		}
		v = this.powerUpInfo.currentBingos.get(pColor.GOLD)!;
		if(v > 0) {
			this.workingParams.onHit *= (1+(0.5*v));
		}
		v = this.powerUpInfo.currentBingos.get(pColor.RAINBOW)!;
		if(v > 0) {
			this.scene.gameData.extraMaxLives = v;
		}
	}

	resetScene(scene: GameScene){
		this.scene = scene;
		this.turretDisplay = new TurretModel(this.scene,this.x,this.y,this);
		this.keys = scene.input.keyboard?.addKeys({
			up: 'W',		up2: 'Up',
			down: 'S',		down2: 'Down',
			left: 'A',		left2: 'Left',
			right: 'D',		right2: 'Right',
			shift: 'Shift',
		});
	}

    processDamage(){
		return 5;
    }

	takeDamage(dmg: number) {
		this.health -= dmg;
	}

	handleInput(): number[]{
		let vec = [0,0];
		if(this.keys.up.isDown || this.keys.up2.isDown){
			vec[1] += -1;
		}
		if(this.keys.down.isDown || this.keys.down2.isDown){
			vec[1] += 1;
		}

		if(this.keys.left.isDown || this.keys.left2.isDown){
			vec[0] += -1;
		}
		if(this.keys.right.isDown || this.keys.right2.isDown){
			vec[0] += 1;
		}

		return vec;
	}

	processVelocity(n: number[], d: number) {
		let mod = 1;
		if((n[0] != 0) && (n[1] != 0)){
			mod = 1/Math.sqrt(2);
		}
		if(this.keys.shift.isDown) {
			mod *= 0.5;
		}
		this.x += this.vel*d/1000*mod*n[0];
		this.y += this.vel*d/1000*mod*n[1];
		this.processBounds();
	}

	processBounds(){
		if(this.x > (1920-this.radius)) {
			this.x = (1920-this.radius);
		}
		if(this.x < (0+this.radius)) {
			this.x = (0+this.radius);
		}

		if(this.y > (1080-this.radius)) {
			this.y = (1080-this.radius);
		}
		if(this.y < (0+this.radius)) {
			this.y = (0+this.radius);
		}
		
	}

	danmakuMode(){
		this.danmaku = true;
	}

	danmakuDisplay(){
		this.radius = 10;
		this.turretDisplay.danmaku();
	}

	heal(){

	}

    processClick(){
       //this.firing = true;
    }

    updateAngleManual(d: number){

    }

    updateAngleAuto(d: number){

    }

    fire() {
        this.firing = true;
    }

    unfire(){
        this.firing = false;
    }

	place(){
		this.scene.add.existing(this.turretDisplay);
	}




    /*
	doABarrelRoll() {
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});
		}
	}
    */
}
