import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";
import { UpgradeScene } from "@/scenes/UpgradeScene";
import { PowerUp, pColor } from "./PowerUp";


export class PowerUpButton extends Button {
    public scene: UpgradeScene;
    public powerUpID: number;
    public sprite: string = "";
    public spriteText: string = "";
    public txtDisplay: Phaser.GameObjects.Text;
    public sp: Phaser.GameObjects.Sprite;
    public loci: number[][] = [
		[128, 440], [384, 440], [640, 440],
		[128, 696], [384, 696], [640, 696],
		[128, 952], [384, 952], [640, 952]
	];
    private magnet: boolean;
    public snapped: boolean = false;
    public mode: number;
    private static FACTORY: number = 0;
    private static INSTALL: number = 1;
    public color: number;
    public pType: number;
    private isDragging: boolean = false;
    public deleteFlag: boolean = false;
    private DEFAULT_RADIUS: number = 75;
    public snappedPosition: number = -1;
    public veiled: boolean = false;
    public discard: boolean = false;

    constructor(scene: UpgradeScene, x: number, y: number, color: number, sprtext: string, mode: number = 0, type = 0){
        super(scene,x,y);
        this.scene = scene;
        scene.add.existing(this);
        this.fetchCorrectSprite(color);
        this.sp = new Phaser.GameObjects.Sprite(scene,0,0,this.sprite);
        this.txtDisplay = this.scene.addText({
			x: 0,
			y: 0,
			size: 50,
			color: "#FFFFFF",
			text: sprtext,
		});
        this.pType = type;
        this.spriteText = sprtext;
        this.color = color;
        this.txtDisplay.setOrigin(0.5,0.5);
        this.mode = mode;
        this.add(this.sp);
        this.add(this.txtDisplay);
        this.bindInteractive(this.sp);
        /*
        this.setInteractive({ draggable: true });
        scene.input.setDraggable(this);
        */

    }

    clone(): PowerUpButton{
        return new PowerUpButton(this.scene, this.x, this.y, this.color, this.spriteText, this.mode, this.pType);
    }

    fetchCorrectSprite(index: number){
        switch(index) {
            case pColor.GRAY: {
                this.sprite = "gray";
                break;
            } case pColor.RED: {
                this.sprite = "red";
                break;
            } case pColor.BLUE: {
                this.sprite = "blue";
                break;
            } case pColor.GOLD: {
                this.sprite = "gold";
                break;
            } case pColor.RAINBOW: {
                this.sprite = "rainbow";
                break;
            }
        }
    }
    
    veil(){
        this.veiled = true;
        this.setAlpha(0.4);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.veiled = false;
        this.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.mode == PowerUpButton.FACTORY) {
            this.scene.splitButton(this);
            this.mode = PowerUpButton.INSTALL;
        }
        this.isDragging = true;
        this.setDepth(1);
        if(this.snapped){
            this.scene.releaseWidget(this.snappedPosition);
            this.snappedPosition = -1;
            this.snapped = false;
        }
    }

    onUp(){
        this.isDragging = false;
        if(!this.snapped) {
            this.snapToLocation(this.DEFAULT_RADIUS);
        }
        if((this.x > 815) || (this.y < 278)) {
            this.veil();
            this.discard = true;
        }
    }

    onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number): void {
        this.x = dragX;
        this.y = dragY;
    }

    snapToPosition(index: number) {
        this.x = this.loci[index][0];
        this.y = this.loci[index][1];
        this.snappedPosition = index;
        this.snapped = true;
        this.setDepth(-1);
        this.scene.replaceWidgetOnBoard(this, this.snappedPosition);
    }

    unsafeSnapToPosition(index: number) {
        this.x = this.loci[index][0];
        this.y = this.loci[index][1];
        this.snappedPosition = index;
        this.snapped = true;
        this.setDepth(-1);
    }

    snapToLocation(radius: number){
        let leastDist = 99999999999;
        let index = -1;
        let m = 1;
        let shouldSnap = false;
        for(let n = 0; n < this.loci.length; n++){
            m = Math.hypot((this.x-this.loci[n][0]),(this.y-this.loci[n][1]))
            if(radius > m){
                shouldSnap = true;
                this.snapped = true;
                if(m < leastDist) {
                    leastDist = m;
                    index = n;
                }
            }
        }
        if((index != -1) && (shouldSnap)){
            this.x = this.loci[index][0];
            this.y = this.loci[index][1];
            this.snappedPosition = index;
            this.snapped = true;
            this.setDepth(-1);
            this.scene.sound.play("place");
            this.scene.replaceWidgetOnBoard(this, this.snappedPosition);
        }
    }

    update(){
        const pointer = this.scene.input.activePointer;
        if(this.isDragging) {
            this.x = pointer.x;
            this.y = pointer.y;
        }

    }

    despawn(){
        //this.scene.returnWidget(this.powerUpID);
        this.destroy();
    }

    duplicate(){
    }
}