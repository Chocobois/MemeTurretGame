import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { BasicEffect } from "./BasicEffect";
import { TurretParams } from "./PowerUpHandler";
import { TextEffect } from "./TextEffect";
export interface ProjectileParams {
    velocity: number;
    radius: number;
    pID: number;
    duration: number;
    gravity: boolean;
    modifier: number;
    isMissile: boolean;
    sprite: string;
    onHitDisabled: boolean;
    critDisabled: boolean;
}

export class Projectile extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public mySprite: Phaser.GameObjects.Image;
    public velocity: number[] = [0,0];
    public deleteFlag: boolean = false;
    public projectileID: number;
    public gravity: boolean = false;
    public radius: number =  10;
    public duration: number = 10000;
    public info: TurretParams;
    public physics: ProjectileParams;
    public angle: number;
    public pTimer: number = 0;
    public pCount: number = -1;
    private hitThisTick: boolean = false;
    private critThisTick: boolean = false;
    private dmgThisTick: number = 0;
    private explosionCD: number = 0;
    private maxExplosionCD: number = 250;
    private hasNotGeneratedGold: boolean = true;
    private flakCooldown = 0;
    private maxFlakCD: number = 250;

    constructor(scene: GameScene, x: number, y: number, angle: number, phys: ProjectileParams, data: TurretParams) {
		super(scene, x, y);
        this.scene = scene;
        this.angle = angle;
        this.physics = phys;
        this.info = data;
        this.velocity = [this.physics.velocity*(Math.cos(this.angle)), this.physics.velocity*(Math.sin(this.angle))];
        this.x = x;
        this.y = y;
		this.mySprite = this.scene.add.image(0, 0, this.physics.sprite);
		this.mySprite.setOrigin(0.5, 0.5);
        this.mySprite.setAngle((180/Math.PI)*this.angle);
        this.add(this.mySprite);
		scene.add.existing(this);
        this.duration = this.physics.duration;
        this.pTimer = Math.trunc(this.info.pierceTimer*(1920/this.physics.velocity)*(1920/75));
        this.pCount = this.info.pierceCount;

	}

    update(d: number){
        this.x += (d*this.velocity[0]/1000);
        this.y += (d*this.velocity[1]/1000);
        this.duration -= d;
        this.hitThisTick = false;
        this.critThisTick = false;
        this.dmgThisTick = 0;

        if(this.explosionCD > 0){
            this.explosionCD -= d;
            if(this.explosionCD <= 0) {
                this.explosionCD = 0;
            }
        }

        if(this.flakCooldown > 0){
            this.flakCooldown -= d;
            if(this.flakCooldown <= 0) {
                this.flakCooldown = 0;
            }
        }

        if(this.duration <= 0) {
            this.die();
        }
        if ((this.x > 2480) || (this.x < -300)){
            this.die();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.die();
        }

    }

    hitCheck(target: Enemy)
    {
        return Math.hypot(this.x-target.x, this.y-target.y) < (this.physics.radius + target.hitRadius);
    }

    handleCollisionEffects(){
        if(!this.hitThisTick) {
            return;
        }
        if(this.info.canExplode && (this.explosionCD <= 0)){
            this.spawnExplosions();
        }
        if(this.info.flak && (this.flakCooldown <= 0)) {
            this.spawnFlak();
        }
        if(this.physics.isMissile) {
            this.scene.sound.play("meme_explosion_sound");
            return;
        } else if (this.info.canPierce){
            this.scene.sound.play("hit_pierce");
        } else {
            this.scene.sound.play("hit_1");
        }
        if(this.critThisTick) {
            this.scene.sound.play("crit");
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.dmgThisTick)+" !", "aqua", 75, true, "fuchsia"));
        } else {
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.dmgThisTick)+"", "red", 50));
        }
        if((this.info.onHitGold > 0) && (this.hasNotGeneratedGold))
        {
            this.hasNotGeneratedGold = false;
            this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.info.onHitGold) +" €", "yellow", 30, true, "white", 800, 100, 0.7, 0));
        }
    }

    spawnExplosions(){
        let xx = this.x;
        let yy = this.y;
        let nscale = ((2*this.info.explRad)/220);
        let pdr = this.cloneProjectileData(this.physics);
        let pinfr = this.cloneTurretData(this.info);
        pinfr.flak = false;
        pinfr.canPierce = true;
        pinfr.pierceCount = -1;
        pinfr.pierceMod = 1;
        pinfr.pierceTimer = 99999999;
        pinfr.baseDamage = this.info.explDmg*this.info.baseDamage*this.info.pierceMod;
        if(this.info.useScaling) {
            pinfr.baseDamage *= this.scene.gameData.scaling;
        }
        pinfr.canExplode = false;
        pdr.isMissile = false;
        pdr.velocity = 0;
        pdr.duration = 225;
        pdr.radius = 75;
        pdr.sprite = "blank";
        pdr.onHitDisabled = true;
        pdr.critDisabled = true;

        for (let ii = 0; ii < this.info.explCount; ii++){
            xx = this.x-60+(Math.random()*120);
            yy = this.y-60+(Math.random()*120);
            this.scene.addProjectile(new Projectile(this.scene, xx, yy, 0, this.cloneProjectileData(pdr), this.cloneTurretData(pinfr)));
            this.scene.addHitEffect(new BasicEffect(this.scene, "explosion_orange", xx, yy, 25, 36, false, 0, Math.random()*360, nscale));
        }
        this.explosionCD = this.maxExplosionCD;
    }

    spawnFlak(){
        let pdr = this.cloneProjectileData(this.physics);
        let pinfr = this.cloneTurretData(this.info);
        pinfr.baseDamage = 5;
        if(this.info.useScaling) {
            pinfr.baseDamage *= this.scene.gameData.scaling;
        }
        pinfr.flak = false;
        pinfr.canPierce = true;
        pinfr.pierceCount = this.info.pierceCount;
        pinfr.pierceMod = 1;
        pinfr.pierceTimer = 3;
        pinfr.canExplode = true;
        pdr.isMissile = false;
        pdr.duration = 10000;
        pdr.radius = 5;
        pdr.sprite = "flak";
        pdr.onHitDisabled = false;

        for (let ii = 0; ii < this.info.flakAmount; ii++){
            this.scene.addProjectile(new Projectile(this.scene, this.x, this.y, Math.random()*360, this.cloneProjectileData(pdr), this.cloneTurretData(pinfr)));
        }
        this.flakCooldown = this.maxFlakCD;
    }

    smite(target: Enemy){
        target.unSmited = false;
        let sm = 0;
        sm = target.health*(1-this.info.smitePercent);
        target.takeDamage(sm);
        this.scene.addHitEffect(new BasicEffect(this.scene, "bad_fire", this.x, this.y-110, 6, 70, false, 0, 0, 1));
        this.dmgThisTick += sm;
        this.critThisTick = true;
        this.scene.sound.play("bigfire");
    }

    collide(target: Enemy){
        if(target.noHitCheck){
            return;
        }
        if(this.deleteFlag || target.deleteFlag) {
            return;
        } else if(this.hitCheck(target))
        {
            let ddmg = 0;
            let mult = 1;
            if(this.info.useScaling){
                mult = this.scene.gameData.scaling;
            }
            if(this.info.canSmite) {
                if(target.unSmited){
                    this.smite(target);
                }
            }
            if(this.info.slow < 1){
                target.slow = this.info.slow;
                target.slowTimer = 2000;
            }
            if(this.info.canPierce) {
                ddmg = this.recalculateDamage(mult*this.physics.modifier*this.info.baseDamage*this.info.pierceMod, target);
                if(target.takePierceDamage(ddmg, this.physics.pID, this.pTimer)) {
                    if(this.pCount > 0) {
                        this.pCount--;
                    }
                    if(this.pCount == 0) {
                        this.deleteFlag = true;
                    }
                    this.hitThisTick = true;
                    this.scene.addHitEffect(new BasicEffect(this.scene, "hit_spark", this.x, this.y, 3, 50, false, 0, Math.random()*360, 1));
                }
            } else if (this.physics.isMissile) {
                if(target.collidedWithMissile)
                {
                    return;
                }
                target.collidedWithMissile = true;
                let pd = this.cloneProjectileData(this.physics);
                let pinf = this.cloneTurretData(this.info);
                this.scene.addHitEffect(new BasicEffect(this.scene, "meme_explosion", this.x, this.y, 18, 50, false, 0));
                pinf.canPierce = true;
                pinf.pierceCount = -1;
                pinf.pierceMod = 1;
                pinf.pierceTimer = 99999999;
                pinf.baseDamage *= 2.0;
                pinf.baseDamage += this.info.missileDmg;
                pinf.baseDamage *= mult;
                pd.isMissile = false;
                pd.velocity = 0;
                pd.duration = 225;
                pd.radius = 75;
                pd.sprite = "blank";
                pd.onHitDisabled = true;
                this.hitThisTick = true;
                this.scene.addProjectile(new Projectile(this.scene, this.x, this.y, 0, pd, pinf));
                this.deleteFlag = true;
            } else {
                ddmg = this.recalculateDamage(mult*this.physics.modifier*this.info.baseDamage, target);
                target.takeDamage(ddmg);
                this.scene.addHitEffect(new BasicEffect(this.scene, "hit_spark", this.x, this.y, 3, 50, false, 0, 0, 1));
                this.hitThisTick = true;
                this.deleteFlag = true;
            }

            if(!this.physics.onHitDisabled) {
                if(this.info.onHit > 0) {
                    let xdmg = 0;
                    xdmg = this.recalculateDamage(mult*this.info.onHit, target);
                    this.scene.sound.play("onhit");
                    this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 15, false, 0, (Math.random()*360), 0.5));
                    this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(xdmg)+"", "blue", 30));
                    target.takeDamage(xdmg);

                }

            }
            this.dmgThisTick += ddmg;
        }
    }

    recalculateDamage(dmg: number, target: Enemy): number{
        let r = dmg;
        let mult = 1;
        let mod = 0;
        if((target.armor[0] == 1) && (target.armor [1] == 0)) {
            return r;
        }
        mult = 100/(100+Math.round((target.armor[0]*(this.info.percentPen))-this.info.flatPen));
        mod = Math.round(((target.armor[1]*(this.info.percentPen))-this.info.flatPen));
        if(mult > 1) {
            mult = 1;
        }
        if(mod < 0) {
            mod = 0;
        }
        if(!this.physics.critDisabled){
            r = this.calculateCrit(r, target);
        }
        r *= mult;
        r -= mod;
        if(r <= 1) {
            r = 1;
        }
        return Math.round(r);
    }

    calculateCrit(dmg: number, target:Enemy): number{
        let cr = this.info.critChance;
        if(target.health <= (0.75*target.maxHealth)) {
            cr += this.info.chainCrit;
        }
        if(cr > 1) {
            cr = 1;
        }

        if(Math.random() < cr) {
            this.critThisTick = true;
            return ((this.info.critDmg)*dmg);
        } else {
            return dmg;
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
            burst: t.burst, burstAmount: t.burstAmount
        };
	}

    die(){
        this.deleteFlag = true;
        this.mySprite.setVisible(false);
    }

}
