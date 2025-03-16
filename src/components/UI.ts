import { GameScene } from "@/scenes/GameScene";
import { GlobalVariables } from "./GlobalVariables";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private dataHandler: GlobalVariables;
	private livesCounter: Phaser.GameObjects.Image;
	private livesText: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelHeight = 200;

		this.panel = this.scene.add.container(0, 0);
		this.add(this.panel);

		this.background = this.scene.add.image(0, 0, "hud");
		this.background.setScale(panelHeight / this.background.height);
		this.livesCounter = this.scene.add.image(326,940, "lives_bar");
		this.livesCounter.setScale(2,2);
		this.panel.add(this.background);
		this.add(this.livesCounter);
		this.dataHandler = this.scene.gameData;

		this.text = this.scene.addText({
			x: -50,
			y: 0,
			size: 40,
			color: "#FFFFFF",
			text: "Gold: " + this.dataHandler.gold + " €",
		});
		this.text.setStroke("black", 4);
		this.text.setOrigin(0, 0.5);
		this.panel.add(this.text);

		this.livesText = this.scene.addText({
			x: 136,
			y: 900,
			size: 70,
			color: "#FF007F",
			text: "Lives: " + this.dataHandler.lives + "x ♥",
		});

		this.add(this.livesText);

		this.panel.setPosition(
			this.scene.W - this.background.displayWidth / 2 - 30,
			this.scene.H - this.background.displayHeight / 2 - 30
		);
	}

	update(time: number, delta: number) {
		this.text.setText("Gold: " + this.dataHandler.gold + " €")
		if(this.dataHandler.lives > 0) {
			this.livesText.setText("Lives: " + this.dataHandler.lives + "x ♥");
		} else {
			this.livesText.setText("U SUCK");
		}


	}
}
