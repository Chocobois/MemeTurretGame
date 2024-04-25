import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

import { NextSceneButton } from "@/components/elements/NextSceneButton";
import { GlobalVariables } from "@/components/GlobalVariables";


export class TransitionScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Image;
    public dataHandler: GlobalVariables;
	private player: Player;
	private ui: UI;
	public timer: number = 3000;
	public curProjID: number = 0;
    public nextSceneButton: NextSceneButton;
    public index: number = 0;
    public imageList: string[] = ["widgets_0", "widgets_1", "widgets_2", "widgets_3", "widgets_4"];
    public fadeTimer: number = 500;
    public waitTimer: number = 1000;
    //
	constructor() {
		super({ key: "TransitionScene" });

		//this.dataHandler = new GlobalVariables();

		//this.bb = new Phaser.GameObjects.Container(this);

	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.dataHandler = data.gameData;
	}

	create(): void {
		this.fade(false, 600, 0x000000);
		this.background = this.add.image(0, 0, this.imageList[this.index]);
		this.background.setOrigin(0);
		this.background.setDepth(-3);
        this.fitToScreen(this.background);
        this.overlay = this.add.image(0, 0, "blank_bkg");
		this.overlay.setOrigin(0);
		this.overlay.setDepth(-1);
        this.overlay.setAlpha(0);
		this.fitToScreen(this.overlay);
		this.nextSceneButton = new NextSceneButton(this,1792,952);
        this.nextSceneButton.veil();
        this.waitTimer = 1000;
	}

	update(time: number, delta: number) {
        if(this.fadeTimer > 0) {
            this.fadeTimer -= delta;
            if(this.fadeTimer <= 0) {
                this.fadeTimer = 0;
                this.overlay.setAlpha(0);
                this.waitTimer = 1000;
            } else {
                this.overlay.setAlpha(this.fadeTimer/500);
            }
        }
        if(this.waitTimer > 0) {
            this.waitTimer -= delta;
            if(this.waitTimer <= 0) {
                this.waitTimer = 0;
                this.nextSceneButton.unveil();
            }
        }
	}

    nextScene(): void {
        if(this.index < (this.imageList.length-1)) {
            this.index++;
            this.background.setTexture(this.imageList[this.index]);
            this.overlay.setTexture(this.imageList[this.index-1]);
            this.overlay.setAlpha(1);
            this.fitToScreen(this.overlay);
            this.fadeTimer = 500;
            this.nextSceneButton.veil();
        } else {
            this.endStage();
        }


    }

	endStage(){
        this.dataHandler.seenTransition = true;
		this.scene.start("UpgradeScene", {gameData: this.dataHandler});
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
