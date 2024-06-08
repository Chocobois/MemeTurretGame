import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

import { title, version } from "@/version.json";
import { GlobalVariables } from "@/components/GlobalVariables";

const creditsLeft = `${title} 

@Handle
@Handle
@Handle`;

const creditsRight = `

role
role
role`;

export class TitleScene extends BaseScene {
	public sky: Phaser.GameObjects.Image;
	public background: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;
	public character: Phaser.GameObjects.Image;


	public a1: Phaser.GameObjects.Image;
	public b1: Phaser.GameObjects.Image;
	public c1: Phaser.GameObjects.Image;
	public tbkg: Phaser.GameObjects.Image;
	public fscreen: Phaser.GameObjects.Image;

	public initTimer: number = -20;
	public fTimer: number = -20;
	public initiated: boolean = false;
	public placed: boolean = false;
	public ready: boolean = false;

	public credits: Phaser.GameObjects.Container;
	public title: Phaser.GameObjects.Text;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public gameDataHandler: GlobalVariables;

	public isStarting: boolean;

	constructor() {
		super({ key: "TitleScene" });
		this.gameDataHandler = new GlobalVariables();
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.sky = this.add.image(this.CX, this.CY, "title_sky");
		this.containToScreen(this.sky);
		this.background = this.add.image(
			this.CX,
			0.9 * this.CY,
			"title_background"
		);
		this.containToScreen(this.background);
		this.background.setVisible(false);
		this.foreground = this.add.image(this.CX, this.CY, "title_foreground");
		this.foreground.setVisible(false);
		this.containToScreen(this.foreground);
		this.character = this.add.image(this.CX, this.CY, "turret_image");
		this.containToScreen(this.character);
		this.character.setDepth(7);

		this.a1 = this.add.image(0,650,"alpha");
		this.a1.setOrigin(0,0);
		this.a1.setDepth(5);
		this.a1.setAlpha(0);

		this.b1 = this.add.image(700,0,"beta");
		this.b1.setOrigin(0,0);
		this.b1.setDepth(5);
		this.b1.setAlpha(0);

		this.c1 = this.add.image(0,0,"gamma");
		this.c1.setOrigin(0,0);
		this.c1.setDepth(8);
		this.c1.setVisible(false);

		this.tbkg = this.add.image(0,0,"tt1");
		this.tbkg.setOrigin(0,0);
		this.tbkg.setDepth(3);
		this.fitToScreen(this.tbkg);

		this.fscreen = this.add.image(0,0,"white_bkg");
		this.fscreen.setOrigin(0,0);
		this.fscreen.setDepth(9);
		this.fscreen.setVisible(false);
		this.fitToScreen(this.fscreen);

		this.background.setVisible(false);
		this.background.setDepth(-5);
		this.background.setAlpha(0);
		this.background.y += 4000;
		this.foreground.y += 1000;
		this.character.y += 1000;

		this.title = this.addText({
			x: 0.25 * this.W,
			y: 0.7 * this.H,
			size: 160,
			color: "#000",
			text: "",
		});
		this.title.setOrigin(0.5);
		this.title.setStroke("#FFF", 8);
		this.title.setPadding(2);
		this.title.setVisible(false);
		this.title.setAlpha(0);

		this.subtitle = this.addText({
			x: 0.25 * this.W,
			y: 0.87 * this.H,
			size: 120,
			color: "#000",
			text: "Tap to start",
		});
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#FFF", 3);
		this.subtitle.setPadding(2);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);
		this.subtitle.setDepth(8);
		this.subtitle.setY(-1000);

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#000",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 4);
		this.tap.setPadding(2);

		this.version = this.addText({
			x: this.W,
			y: this.H,
			size: 40,
			color: "#000",
			text: version,
		});
		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setStroke("#FFF", 4);
		this.version.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.65 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setStroke("#FFF", 10);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 0.85 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setStroke("#FFF", 10);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_first", { volume: 0.4 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play();

		// Input

		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.background.visible) {

			this.background.y += 0.02 * (this.CY - this.background.y);
			this.foreground.y += 0.025 * (this.CY - this.foreground.y);
			this.character.y += 0.02 * (this.CY - this.character.y);

			this.background.alpha += 0.03 * (1 - this.background.alpha);
			this.character.scaleX = 1.5*Math.sin((3 * time) / 1000);

			this.title.alpha +=
				0.02 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha +=
				0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			this.version.alpha +=
				0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if(this.subtitle.alpha > 0.5) {
				if(!this.initiated) {
					this.initTimer = 750;
					this.initiated = true;
				}
			}
			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);
			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		if(this.placed && (this.fTimer > 0)) {
			this.fTimer -= delta;
			if(this.fTimer <= 0) {
				this.fTimer = 0;
				this.fscreen.setAlpha(0);
				this.fscreen.setVisible(false);
			} else {
				this.fscreen.setAlpha(this.fTimer/500);
			}
			if(this.fTimer < 150) {
				if(!this.ready) {
					this.ready = true;
				}
			}
		}

		if(this.placed) {
			this.c1.y = -30+(30*Math.sin(time/800));
		}

		if(this.initiated && (this.initTimer > 0)) {
			this.initTimer -= delta;

			if(this.initTimer < 200) {
				if(!this.placed) {
					this.placed = true;
					this.fTimer = 500;
					this.fscreen.setVisible(true);
					this.c1.setVisible(true);
					this.tbkg.setTexture("tt2");
					this.subtitle.setY(0.87 * this.H);
					this.musicTitle.stop();
					this.musicTitle = new Music(this, "m_ba", { volume: 0.2 });
					this.musicTitle.play();
				}
			}

			if(this.initTimer <= 0){
				this.initTimer = 0;
				this.a1.y = 0;
				this.b1.x = 0;
				this.a1.setAlpha(1);
				this.b1.setAlpha(1);
			} else {
				this.a1.y=650*(this.initTimer/750);
				this.b1.x=700*(this.initTimer/750);
				this.a1.setAlpha(1-(this.initTimer/750));
				this.b1.setAlpha(1-(this.initTimer/750));
			}

		}

		this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	progress() {
		if(!this.ready) {
			return;
		}
		if (!this.background.visible) {
			this.onBar(1);
		} else if (!this.subtitle.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play("t_rustle", { volume: 0.3 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					this.musicTitle.stop();
					this.scene.start("GameScene", {gameData: this.gameDataHandler});
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 2) {
			this.title.setVisible(true);
		}
		if (bar >= 4) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}
