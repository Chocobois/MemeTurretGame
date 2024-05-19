import { GameScene } from "@/scenes/GameScene";
import { TurretParams } from "./PowerUpHandler";
import { Turret } from "./Turret";



export class TurretModel extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private baseSprite: Phaser.GameObjects.Sprite;
    private gunSprite: Phaser.GameObjects.Sprite;
	public isTouched: boolean;
	public isTapped: boolean;
    public firing: boolean = false;
    private curAngle: number = 0;
	public workingParams: TurretParams;
	public hpDisplay: Phaser.GameObjects.Rectangle;
	public owner: Turret;
	public hbox: Phaser.GameObjects.Image;
	public boosters:Phaser.GameObjects.Sprite;
	public danmakuMode: boolean = false;
	public updated: boolean = false;
	public bTimer: number = 50;
	public bFrame: number = 0;

	constructor(scene: GameScene, x: number, y: number, owner:Turret, base: string = "turretbase", gun: string = "gun_1") {
		super(scene, x, y);
        this.scene = scene;
		this.baseSprite = this.scene.add.sprite(0, 0, "turretbase");
		this.baseSprite.setOrigin(0.5, 0.5);
        this.gunSprite = this.scene.add.sprite(0, 0, "gun_1");
		this.gunSprite.setOrigin(0.5, 0.5);
		this.boosters = this.scene.add.sprite(0,0,"boosters");
		this.boosters.setOrigin(0.5,0.5);
		this.boosters.setVisible(false);
		this.hbox = this.scene.add.image(0,0,"heart");
		this.hbox.setOrigin(0.5,0.5);
		this.hbox.setVisible(false);
		this.add(this.baseSprite);
        this.add(this.gunSprite);
		this.add(this.boosters);
		this.add(this.hbox);
		this.hpDisplay = this.scene.add.rectangle(-128, (this.baseSprite.height/2), 256, 20, 0x00FF00, 0.5);
        this.hpDisplay.setVisible(false);
		this.hpDisplay.setOrigin(0,0);
		this.add(this.hpDisplay);
		this.owner=owner;
	}

	update(d: number, a: number) {
		this.x=this.owner.x;
		this.y=this.owner.y;
        this.gunSprite.setAngle((360/(2*Math.PI))*a);
		if(this.danmakuMode) {
			if(this.bTimer > 0) {
				this.bTimer -= d;
				if(this.bTimer <= 0) {
					this.bFrame++;
					if(this.bFrame > 1) {
						this.bFrame = 0;
					}
					this.boosters.setFrame(this.bFrame);
					this.bTimer = 50;
				}
			}
		}

	}

	danmaku(){
		this.danmakuMode = true;
		this.hbox.setVisible(true);
		this.boosters.setVisible(true);
	}

	updateHPDisplay(h: number, maxh: number) {
        if(h < maxh) {
            if(h > 0) {
                let sc = h/maxh;
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
        } else {
			this.hpDisplay.setVisible(false);
		}
	}

}
