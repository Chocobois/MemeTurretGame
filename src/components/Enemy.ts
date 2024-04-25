import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
interface EnemyType {
    health: number;
    sprite: string; frameData: number[]; anim: boolean;
    sound: string;
    radius: number;
    vx: number;
    vy: number;
    variancex: number;
    variancey: number;
    bounce: boolean; amp: number;
    armor: number[]; shoot: boolean; burst: number; cooldown: number;
    reflect: boolean; reflectAmtX: number; reflectAmtY: number;
    shotType: number; shootRadius: number; shootSound: string;


}
export class Enemy extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public mySprite: Phaser.GameObjects.Sprite;
    private hpDisplay: Phaser.GameObjects.Rectangle;
    public velocity: number[] = [0,0];
    public health: number = 100;
    public maxHealth: number = 100;
    public hitRadius: number = 10;
    public deleteFlag: boolean = false;
    private projectileTracker: Map<number, number>;
    private hasPlayedSpawnSound: boolean = false;
    public noHitCheck: boolean = true;
    private bounce: boolean = false;
    private amplitude: number = 1;
    public collidedWithMissile: boolean = false;
    public armor: number [] = [0,0];
    public unSmited: boolean = true;
    public slow: number = 1;
    public slowTimer: number = 0;
    public deadSound: string = "dead_1";
    private burstCounter: number = 0;
    private maxBurst: number = 3;
    private cooldown: number = 0;
    private maxCooldown: number = 8000;
    private shootRadius: number = 800;
    private burstCooldown: number = 50;
    private myInfo: EnemyType;
    private animTimer: number = 0;
    private curFrame: number = 0;
    private reflect: boolean = false;
    private queueReflect: boolean = false;
    private reflectCounterX: number = 2;
    private reflectCounterY: number = 2;
    private shotTypes: EnemyBulletParam[] = [
        {
            velocity: 2000,
            explode: false,
            damage: 10,
            sprite: "small_bullet",
            duration: 10000,
            radius: 5,
            critChance: 0.2,
            critDmg: 2.0,
        },
        {
            velocity: 1500,
            explode: false,
            damage: 15,
            sprite: "purple_bullet",
            duration: 10000,
            radius: 8,
            critChance: 0,
            critDmg: 2.0,
        },
        {
            velocity: 2200,
            explode: true,
            damage: 150,
            sprite: "missile",
            duration: 10000,
            radius: 12,
            critChance: 0,
            critDmg: 2.0,
        },
    ]
    private shotIndex: number = 0;

    private types: EnemyType[] = [
        {
            health: 30,
            sprite: "enemy_1", frameData: [1,50], anim: false,
            sound: "dead_1",
            radius: 100,
            vx: -300, vy: 0, variancex: -100, variancey: 0,
            bounce: true, amp: 2, armor: [0,0], shoot: true, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 60,
            sprite: "enemy_2", frameData: [1,100], anim: false,
            sound: "dead_2",
            radius: 100,
            vx: -150, vy: 0, variancex: -50, variancey: 0,
            bounce: true, amp: 1, armor: [30,0], shoot: true, burst: 1, cooldown: 600,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 1, shootRadius: 1000, shootSound: "big_gun_1",
        },
        {
            health: 300,
            sprite: "enemy_3", frameData: [1,100], anim: false,
            sound: "dead_1",
            radius: 100,
            vx: -600, vy: 0, variancex: -250, variancey: 0,
            bounce: true, amp: 1, armor: [40,3], shoot: false, burst: 6, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 1, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 50000,
            sprite: "enemy_4", frameData: [1,100], anim: false,
            sound: "dead_3",
            radius: 160,
            vx: -60, vy: 0, variancex: -20, variancey: 0,
            bounce: true, amp: 1, armor: [50,5], shoot: true, burst: 1, cooldown: 15000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 150,
            sprite: "enemy_4", frameData: [1,100], anim: false,
            sound: "dead_1",
            radius: 160,
            vx: -60, vy: 0, variancex: -20, variancey: 0,
            bounce: true, amp: 1, armor: [40,2], shoot: false, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 80,
            sprite: "enemy_5", frameData: [2,50], anim: true,
            sound: "dead_4",
            radius: 110,
            vx: -200, vy: 0, variancex: -70, variancey: 50,
            bounce: true, amp: 8, armor: [20,3], shoot: true, burst: 3, cooldown: 8000,
            reflect: true, reflectAmtX: 2, reflectAmtY: 200,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
    ];


    constructor(scene: GameScene, x: number, y: number, type: number = 0) {
		super(scene, x, y);
        this.scene = scene;
        scene.add.existing(this);
        this.velocity = [this.types[type].vx-this.types[type].variancex+(Math.trunc(2*Math.random()*this.types[type].variancex)),
            this.types[type].vy-this.types[type].variancey+(Math.trunc(2*Math.random()*this.types[type].variancey))];
        this.x = x;
        this.y = y;
        this.myInfo = this.types[type];
        this.bounce = this.types[type].bounce;
        this.health = this.types[type].health;
        this.maxCooldown = this.myInfo.cooldown;
        this.maxBurst = this.myInfo.burst;
        this.shootRadius = this.myInfo.shootRadius;
        this.shotIndex = this.myInfo.shotType;
        this.maxHealth = this.health;
        this.projectileTracker = new Map();
        this.armor = this.types[type].armor;
        this.hitRadius = this.types[type].radius;
        this.deadSound = this.types[type].sound;
        if(this.myInfo.anim) {
            this.animTimer = this.myInfo.frameData[0];
        }
        if(this.myInfo.reflect) {
            this.queueReflect = true;
            this.reflectCounterX = this.myInfo.reflectAmtX;
            this.reflectCounterY = this.myInfo.reflectAmtY;
        }
        this.deleteFlag = false;
		this.mySprite = this.scene.add.sprite(0, 0, this.types[type].sprite);
        this.hpDisplay = this.scene.add.rectangle(-64, (this.mySprite.height/2), 128, 20, 0x00FF00, 0.5);
        this.hpDisplay.setVisible(false);
		this.mySprite.setOrigin(0.5, 0.5);
        this.hpDisplay.setOrigin(0,0);
        this.add(this.mySprite);
        this.add(this.hpDisplay);


		/* Sprite */


		/* Controls */
        /*
		if (this.scene.input.keyboard) {
			this.keyboard = this.scene.input.keyboard.addKeys({
				up1: "W",
				down1: "S",
				left1: "A",
				right1: "D",
				up2: "Up",
				down2: "Down",
				left2: "Left",
				right2: "Right",
			});
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
				.on("down", this.doABarrelRoll, this);
		}

		this.isTouched = false;
		this.isTapped = false;
		this.tappedTimer = 0;
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.touchPos = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};
                */
	}

    cloneEnemyBulletParams(e: EnemyBulletParam){
        return {
            velocity: e.velocity,
            explode: e.explode,
            damage: e.damage,
            sprite: e.sprite,
            duration: e.duration,
            radius: e.radius,
            critChance: e.critChance,
            critDmg: e.critDmg,
        }
    }

    takeDamage(dmg: number): boolean{
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

    update(d: number, t: number){
        this.collidedWithMissile = false;
        this.x += (this.slow*this.velocity[0])*d/1000;
        this.y += (this.slow*this.velocity[1])*d/1000;

        if(this.bounce){
            this.y += this.slow*this.amplitude*4*Math.sin(t/250);
        }
        this.handleReflect();
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }
        if(this.noHitCheck && (this.x < (1980+0))){
            this.noHitCheck = false;
        }
        if(!this.hasPlayedSpawnSound && this.x < 2080) {
            this.scene.sound.play("spawn", {volume: 0.25});
            this.hasPlayedSpawnSound = true;
        }
        if(this.slowTimer > 0) {
            this.slowTimer -= d;
            if(this.slowTimer <= 0) {
                this.slowTimer = 0;
                this.slow = 1;
            }
        }
        this.updateHealthDisplay(d);
        if ((this.x > 2480)){
            this.despawn();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.despawn();
        } else if ((this.x < -300)) {
            this.scene.sound.play("escape"); 
            this.despawn();
            
        }

    }

    handleReflect(){
        if(this.queueReflect) {
            if(this.x < (1920-this.mySprite.width)) {
                this.reflect = true;
                this.queueReflect = false;
            }
        }
        if((this.reflect != true)) {
            return;
        }
        if((this.reflectCounterX > 0)) {
            if (this.x < (0 + this.mySprite.width)) {
                if(this.velocity[0] < 0) {
                    this.velocity[0] *= -1;
                    this.mySprite.setScale(-1,1);
                    this.reflectCounterX--;
                }
            }
            if (this.x > (1920 - this.mySprite.width)) {
                if(this.velocity[0] > 0) {
                    this.velocity[0] *= -1;
                    this.mySprite.setScale(1,1);
                    this.reflectCounterX--;
                }
            }
        }

        if(this.reflectCounterY > 0) {
            if (this.y < (0 + this.mySprite.height)) {
                if(this.velocity[1] < 0) {
                    this.velocity[1] *= -1;
                    this.reflectCounterY--;
                }
            }
            if (this.y > (1080 + this.mySprite.height)) {
                if(this.velocity[1] > 0) {
                    this.velocity[1] *= -1;
                    this.reflectCounterY--;
                }
            }
        }


    }

    updateAnims(d: number) {
        if(!this.myInfo.anim) {
            return;
        }

        if(this.animTimer > 0) {
            this.animTimer -= d;
            if(this.animTimer <= 0) {
                this.curFrame++;
                if((this.curFrame > (this.myInfo.frameData[0] - 1))) {
                    this.curFrame = 0;
                }
                this.mySprite.setFrame(this.curFrame);
                this.animTimer = this.myInfo.frameData[1];
            }
        }

    }

    updateShootingCycle(d: number){
        if(this.x < 0) {
            return;
        }
        if((Math.hypot(this.x-this.scene.activeTurret.x, this.y-this.scene.activeTurret.y) < (this.shootRadius))){
            if(this.cooldown > 0) {
                this.cooldown -= d;
            }
            if(this.cooldown <= 0) {
                if(this.burstCounter == 0) {
                    this.burstCounter = this.maxBurst;
                }
                if(this.burstCounter > 0) {
                    let sAngle = Math.atan2((this.scene.activeTurret.y-this.y),(this.scene.activeTurret.x-this.x));
                    this.scene.sound.play(this.myInfo.shootSound);
                    this.scene.addEnemyProjectile(new EnemyProjectile(this.scene, this.x, this.y, sAngle, this.cloneEnemyBulletParams(this.shotTypes[this.shotIndex])));
                    this.burstCounter--;
                    if(this.burstCounter > 0)
                    {
                        this.cooldown = this.burstCooldown;
                    } else {
                        this.cooldown = this.maxCooldown;
                    }

                }
            }
        }
    }

    updateProjectileTracker(d: number){
        if(this.projectileTracker.size > 0) {
            this.projectileTracker.forEach((value: number, key: number) => {
                if(value > 0) {
                    value -= d;
                    if(value < 0) {
                        value = 0;
                    }
                    this.projectileTracker.set(key, value);
                }
            });
        }
    }

    updateHealthDisplay(d: number){
        if(this.health < this.maxHealth) {
            if(this.health > 0) {
                let sc = this.health/this.maxHealth;
                if((sc <= 0.65) && (sc > 0.3)) {
                    this.hpDisplay.fillColor = 0xFFFF00;
                } else if ((sc <= 0.3)) {
                    this.hpDisplay.fillColor = 0xFF0000;
                } else {
					this.hpDisplay.fillColor = 0x00FF00;
				}
                this.hpDisplay.setVisible(true);
                this.hpDisplay.setScale(sc, 1);
            } else {
                this.hpDisplay.setAlpha(0);
            }
        }
    }

    die(){
        this.scene.sound.play(this.deadSound);
        this.scene.addHitEffect(new BasicEffect(this.scene, "meme_explosion", this.x, this.y, 18, 50, false, 0));
        this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.maxHealth) +" €", "yellow", 60, true, "white", 800, 100, 0.7, 0));
        this.deleteFlag = true;
    }

    despawn(){
        this.deleteFlag = true;   
    }

}
