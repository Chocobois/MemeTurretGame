import { GameScene } from "@/scenes/GameScene";
import { TurretParams } from "./PowerUpHandler";



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

	public updated: boolean = false;

	constructor(scene: GameScene, x: number, y: number, base: string = "turretbase", gun: string = "gun_1") {
		super(scene, x, y);
        this.scene = scene;
		this.baseSprite = this.scene.add.sprite(0, 0, "turretbase");
		this.baseSprite.setOrigin(0.5, 0.5);
        this.gunSprite = this.scene.add.sprite(0, 0, "gun_1");
		this.gunSprite.setOrigin(0.5, 0.5);
		this.add(this.baseSprite);
        this.add(this.gunSprite);
		this.hpDisplay = this.scene.add.rectangle(-128, (this.baseSprite.height/2), 256, 20, 0x00FF00, 0.5);
        this.hpDisplay.setVisible(false);
		this.hpDisplay.setOrigin(0,0);
		this.add(this.hpDisplay);
	}

	update(d: number, a: number) {
        this.gunSprite.setAngle((360/(2*Math.PI))*a);

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
