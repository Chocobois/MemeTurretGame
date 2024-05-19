import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

import { NextSceneButton } from "@/components/elements/NextSceneButton";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Music } from "@/components/Music";


export class EndScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Image;
    public dataHandler: GlobalVariables;
	private player: Player;
	private ui: UI;
	public timer: number = 3000;
	public curProjID: number = 0;
    public nextSceneButton: NextSceneButton;
    public index: number = 0;
    public fadeTimer: number = 500;
    public waitTimer: number = 1000;
    public endMusic: Phaser.Sound.WebAudioSound;
    
    //
	constructor() {
		super({ key: "EndScene" });

	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.dataHandler = data.gameData;
        this.endMusic = new Music(this, this.dataHandler.getEndMusic(), { volume: 0.4 });
		this.endMusic.play();
	}

	create(): void {
		this.fade(false, 600, 0x000000);
		this.background = this.add.image(0, 0, "vscreen");
		this.background.setOrigin(0);
		this.background.setDepth(-3);
        this.fitToScreen(this.background);
	}

	update(time: number, delta: number) {

	}

    nextScene(): void {

    }

	endStage(){
        this.dataHandler.seenTransition = true;
		this.scene.start("TitleScene", {gameData: this.dataHandler});
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

		});
	}
}
