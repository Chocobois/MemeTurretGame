import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Stage } from "@/components/Stage";
import { PowerUp, pColor } from "@/components/PowerUp";
import { PowerUpButton } from "@/components/PowerUpButton";
import { GlobalVariables } from "@/components/GlobalVariables";
import { PowerUpHandler, powerID } from "@/components/PowerUpHandler";
import { Button } from "@/components/elements/Button";
import { ScrollButton } from "@/components/elements/ScrollButton";
import { NextSceneButton } from "@/components/elements/NextSceneButton";
import { Turret } from "@/components/Turret";
import { BasicEffect } from "@/components/BasicEffect";

interface SnapLocation{
	position: number[];
	index: number;
}

export class UpgradeScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Image;
	private player: Player;
	private ui: UI;
	public timer: number = 3000;
	public curProjID: number = 0;
	public stageList: Stage;
	public musicStage: Phaser.Sound.WebAudioSound;
	public dataHandler: GlobalVariables;
    public myWidgets: PowerUp[];
	private currentIndex: number = 0;
	private defaultButton: PowerUpButton;
	private currentWidgetButton: PowerUpButton;
	private widgetDisplay: Phaser.GameObjects.Container;
	private pHandler: PowerUpHandler;
	private static WIDGET_DISPLAY_POSITION: number[] = [1375, 360];
	private static FORWARD_POSITION: number[] = [1750, 345];
	private static BACK_POSITION: number[] = [995, 345];
	public forwardButton: ScrollButton;
	public backButton: ScrollButton;
	private debugText: Phaser.GameObjects.Text;
	private debugText2: Phaser.GameObjects.Text;
	public currentPowerUpButtons: PowerUpButton[];
	public powerBoard: PowerUpButton[];
	public nextSceneButton: NextSceneButton;
	public currentTurret: Turret;
	public bingoMap: Map<number, number>;
	private widgetEffects: BasicEffect[];
	private wTimer: number = 2500;
	private bingoStates: boolean[];

	private alertText: Phaser.GameObjects.Text;
	private titleText: Phaser.GameObjects.Text;
	private descriptionText: Phaser.GameObjects.Text;
	private bingoText: Phaser.GameObjects.Text;
	private grayBingoText: Phaser.GameObjects.Text;
	private redBingoText: Phaser.GameObjects.Text;
	private blueBingoText: Phaser.GameObjects.Text;
	private goldBingoText: Phaser.GameObjects.Text;
	private rainbowBingoText: Phaser.GameObjects.Text;
	private effectsDisplay: Phaser.GameObjects.Container;
	private buttonTimer: number;
	public requireWidget: number = -1;
	private flashTimer: number = 0;


    public descriptions: string[][] = [
		["", "", ""],
        ["", "A plain gray widget. It doesn't do anything special, but the color is still beautiful.", "Gray Widget"],
		["", "A plain red widget. It doesn't do anything special, but the color is still beautiful.", "Red Widget"],
		["", "A plain blue widget. It doesn't do anything special, but the color is still beautiful.", "Blue Widget"],
		["", "A plain gold widget. It doesn't do anything special, but the color is still beautiful.", "Gold Widget"],
		["", "A plain rainbow widget. It doesn't do anything special, but the color is still beautiful.", "Rainbow Widget"],
        //gray
        ["+P", "A widget that increases your base damage by a small amount. Straightforward and useful!", "Power Widget"],
        ["+Cr", "This widget increases your critical strike chance by a flat amount. Hit them where it hurts!", "Precision Widget"],
        ["+Sp", "Increases your projectile speed by a small amount. It's better than nothing right...?", "Velocity Widget"],
        ["+RoF", "Increases your rate of fire by a percentage. Strong and easy to use!", "Rapid Widget"],
        //red
        ["=>", "Gives your primary attack multiple pellets! They're weaker than the main shot, but it's devastating if you can hit 'em all!", "Multishot Widget"],
        ["O/H", "Adds a bit of flat on-hit damage. It's not boosted by crits or base damage increases. I wonder what this is useful for...", "Razor Widget"],
        ["WEX", "Hits have an increased crit rate on damaged enemies. Activates under 75% health. Makes your attacks merciless!", "Spite Widget"],
        ["-Ar", "A widget that helps your attacks ignore some armor. Gives both flat and percent armor ignore. Plain, but super helpfuL!", "Sundering Widget"],
        //blue
        ["<->", "This widget loops the previous widget. Does nothing by itself. I wonder where you should put this...?", "Memory Widget"],
        ["-", "Slows enemies down when they're hit. It's not more damage, but don't underestimate it!", "Freezing Widget"],
        ["-o->", "An awesome widget that makes your shots pierce, but reduces the damage. Hits multiple enemies and hits the same enemy multiple times! Penetration is the best!", "Penetration Widget"],
        ["2xCr", "Doubles your crit chance! A brutally powerful widget. Show them who's boss!", "Force Widget"],
        //gold
        ["*", "Makes your attacks explode on hit for a percentage of the damage! Looks cool, and real powerful too! The explosions don't apply on-hit effects though.", "Huge Widget"],
        ["+RoF+", "An interesting widget that strongly increases your rate of fire, but decreases your accuracy. Nothing beats quantity!", "Storm Widget"], 
        ["+G", "The favorite widget of dragons. Increases all the gold you get by a flat amount!", "Avarice Widget"], 
        ["->G", "This widget gives you a little bit of gold when you damage enemies. Even pennies can make you rich!", "Microtransaction Widget"],
        //rainbow
        ["P^2", "Squares your base damage and enhances other damaging effects! One of a kind, the strongest widget out there!", "Superpower Widget"],
        ["!", "This ferocious widget makes the first hit on an enemy smites it for a percent of its current health. The damage ignores all damage modifiers, including armor! A specialty of dragons!", "Draconic Widget"],
        ["+M", "A widget that gives you a burst of missiles every few shots! Reduce everything to rubble!", "Macross Widget"],
        ["0w0", "This widget gives you a small damage boost. It's not very strong but it will grow in power throughout the whole game!", "Strangely Attractive Widget"],
    ]

    //
	constructor() {
		super({ key: "UpgradeScene" });

		//this.dataHandler = new GlobalVariables();

		//this.bb = new Phaser.GameObjects.Container(this);

	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.dataHandler = data.gameData;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.background = this.add.image(0, 0, "upgrade_page");
		this.background.setOrigin(0);
		this.background.setDepth(-3);
		this.fitToScreen(this.background);
		this.pHandler = new PowerUpHandler(this);
		this.nextSceneButton = new NextSceneButton(this,1792,952);
		this.nextSceneButton.veil();
		this.buttonTimer = 1000;
		this.defaultButton = new PowerUpButton(this, -999, -888, -1, "DEFAULT", 1, 0);
		this.powerBoard = [this.defaultButton.clone(),this.defaultButton.clone(),this.defaultButton.clone(),
			this.defaultButton.clone(),this.defaultButton.clone(),this.defaultButton.clone(),
			this.defaultButton.clone(),this.defaultButton.clone(),this.defaultButton.clone()];
		this.currentPowerUpButtons = [];
		for(let z = 0; z < this.powerBoard.length; z++) {
			this.powerBoard[z].setVisible(false);
			this.currentPowerUpButtons.push(this.powerBoard[z]);
		}
		this.bingoStates = [false, false, false, false, false];
		this.bingoMap = new Map;
		this.currentWidgetButton = this.defaultButton;
		this.currentWidgetButton.setVisible(false);
		this.widgetDisplay = new Phaser.GameObjects.Container(this);
		this.add.existing(this.widgetDisplay);
		this.widgetDisplay.add(this.currentWidgetButton);
		this.effectsDisplay = new Phaser.GameObjects.Container(this);
		this.effectsDisplay.setDepth(5);
		this.add.existing(this.effectsDisplay);
		this.widgetEffects = [];
		
		this.forwardButton = new ScrollButton(this,UpgradeScene.FORWARD_POSITION[0]/2,UpgradeScene.FORWARD_POSITION[1]/2);
		this.forwardButton.setForward();
		this.backButton = new ScrollButton(this,UpgradeScene.BACK_POSITION[0]/2,UpgradeScene.BACK_POSITION[1]/2);
		this.backButton.setBackward();
		this.forwardButton.hide();
		this.backButton.hide();
		this.add.existing(this.forwardButton);
		this.widgetDisplay.add(this.backButton);

		this.requireWidget = this.dataHandler.nextReqWidget;

		this.alertText = this.addText({
			x: 960,
			y: 546,
			size: 80,
			color: "#FFFFFF",
			text: "",
		});
		this.alertText.setOrigin(0.5,0.5);
		this.alertText.setDepth(10000);
		this.titleText = this.addText({
			x: 1400,
			y: 586,
			size: 40,
			color: "#FFFFFF",
			text: "",
		});
		this.descriptionText = this.addText({
			x: 986,
			y: 646,
			size: 35,
			color: "#FFFFFF",
			text: "",
		});
		this.descriptionText.setWordWrapWidth(760);
		this.widgetDisplay.add(this.descriptionText);
		this.widgetDisplay.add(this.titleText);
		this.createBingoTexts();

		this.debugText = this.addText({
			x: 1155/2,
			y: 725/2,
			size: 20,
			color: "#FFFFFF",
			text: "",
		});
		this.debugText2 = this.addText({
			x: 1155/2,
			y: 725,
			size: 20,
			color: "#FFFFFF",
			text: "",
		});
		this.currentTurret = this.dataHandler.myTurrets[this.dataHandler.selectedTurret];
		this.initWidgetDisplay();
		//this.sound.play("siren");
		//this.initTouchControls();
	}

	createBingoTexts(){
		this.bingoText = this.addText({
			x: 20,
			y: 20,
			size: 40,
			color: "#FFA500",
			text: "Current Bingos:",
		});
		this.widgetDisplay.add(this.bingoText);
		this.grayBingoText = this.addText({
			x: 20,
			y: 65,
			size: 30,
			color: "#808080",
			text: "",
		});
		this.widgetDisplay.add(this.grayBingoText);
		this.redBingoText = this.addText({
			x: 20,
			y: 100,
			size: 30,
			color: "#FF0000",
			text: "",
		});
		this.widgetDisplay.add(this.redBingoText);
		this.blueBingoText = this.addText({
			x: 20,
			y: 135,
			size: 30,
			color: "#1E90FF",
			text: "",
		});
		this.widgetDisplay.add(this.blueBingoText);
		this.goldBingoText = this.addText({
			x: 20,
			y: 170,
			size: 30,
			color: "#FFD700",
			text: "",
		});
		this.widgetDisplay.add(this.goldBingoText);
		this.rainbowBingoText = this.addText({
			x: 20,
			y: 205,
			size: 30,
			color: "#FFFFFF",
			text: "",
		});
		this.widgetDisplay.add(this.rainbowBingoText);
	}

	update(time: number, delta: number) {
		//this.ui.update(time, delta);
        const pointer = this.input.activePointer;
		//this.debugText.setText("CURRENT INDEX: " +this.currentIndex + " ; " + this.findNextIndex());
		if(Math.sin(time/50) > 0){
			this.alertText.setColor("#FF0000");
		} else {
			this.alertText.setColor("#FFFF00");
		}
		if(this.wTimer > 0) {
			this.wTimer -= delta;
			if(this.wTimer <= 0) {
				this.wTimer = 2500;
			}
		}
		if(this.flashTimer > 0){
			this.flashTimer -= delta;
			if(this.flashTimer <= 0){
				this.flashTimer = 0;
				this.alertText.setText("");
			} else {
				this.alertText.setAlpha(this.flashTimer/1000);
			}
		}
		if(this.buttonTimer > 0) {
			this.buttonTimer -= delta;
			if(this.buttonTimer <= 0) {
				this.nextSceneButton.unveil();
			}
		}
		let d = ""
		for(let n = 0; n < this.dataHandler.myWidgets.length; n++) {
			d += "[" + this.dataHandler.myWidgets[n][0] + "," + this.dataHandler.myWidgets[n][1] + "," + this.dataHandler.myWidgets[n][2] + "]";
		}
		
		//this.debugText2.setText("ARRAY: " +d);
		
		if(this.currentPowerUpButtons.length > 0)
		{
			for(let n = 0; n < this.currentPowerUpButtons.length; n++){
				this.currentPowerUpButtons[n].update();
				if(this.currentPowerUpButtons[n].deleteFlag){
					this.currentPowerUpButtons[n].destroy();
					this.currentPowerUpButtons.splice(n,1);
				} else {
					if(this.currentPowerUpButtons[n].discard) {
						this.returnWidget(this.currentPowerUpButtons[n].pType);
						this.currentPowerUpButtons[n].deleteFlag = true;
						this.currentPowerUpButtons[n].destroy();
						this.currentPowerUpButtons.splice(n,1);
					}
				}

			}
		}

		//this.player.update(time, delta);
	}

	replaceWidgetOnBoard(p: PowerUpButton, index: number) {
		this.returnWidget(this.powerBoard[index].pType);
		this.powerBoard[index].setVisible(false);
		this.powerBoard[index].deleteFlag = true;
		this.powerBoard[index] = p;
		this.recalculateBingos();
	}

	releaseWidget(index: number){
		this.powerBoard[index] = this.defaultButton.clone();
		this.powerBoard[index].setVisible(false);
		this.currentPowerUpButtons.push(this.powerBoard[index]);
		this.recalculateBingos();
	}

	initWidgetDisplay(){
		let isEmpty = true;
		let index = 0;
		for(let i = 1; i < this.dataHandler.myWidgets.length; i++){
			if(this.dataHandler.myWidgets[i][1] > 0) {
				index = i;
				this.currentIndex = i;
				isEmpty = false;
				break;
			}
		}
		if(!isEmpty) {
			this.currentWidgetButton = new PowerUpButton(this, UpgradeScene.WIDGET_DISPLAY_POSITION[0], UpgradeScene.WIDGET_DISPLAY_POSITION[1], 
				this.pHandler.getColor(index), this.descriptions[index][0], 0, index);
			if(this.dataHandler.myWidgets[index][2] >= this.dataHandler.myWidgets[index][1]) {
				this.currentWidgetButton.veil();
			}
			this.widgetDisplay.add(this.currentWidgetButton);
			this.descriptionText.setText(this.descriptions[this.currentWidgetButton.pType][1]);
			this.titleText.setColor(this.getColorFromColor(this.currentWidgetButton.color));
			this.titleText.setText(this.descriptions[this.currentWidgetButton.pType][2]);
			this.titleText.setOrigin(0.5, 0.5);
			this.forwardButton.unhide();
			this.backButton.unhide();
		}
		if(!(this.currentTurret.powerUpInfo.tableIsEmpty())) {
			let xz = 0;
			for(let q = 0; q < this.powerBoard.length; q++) {
				xz = this.currentTurret.powerUpInfo.widgetTable[q].ID;
				if(xz != powerID.NULL)
				{
					this.powerBoard[q].deleteFlag = true;
					this.powerBoard[q] = new PowerUpButton(this,0,0,this.currentTurret.powerUpInfo.widgetTable[q].color,
						this.descriptions[xz][0], 1, xz);
					this.powerBoard[q].unsafeSnapToPosition(q);
					//this.add.existing(this.powerBoard[q]);
					this.currentPowerUpButtons.push(this.powerBoard[q]);
				}
			}
			this.recalculateBingos();
		}

	}

	findNextIndex(): number{
		if(this.currentIndex < this.dataHandler.myWidgets.length) {
			for(let i = this.currentIndex+1; i < this.dataHandler.myWidgets.length; i++)
			{
				if(this.dataHandler.myWidgets[i][1] > 0) {
					return i;
				}
			}
		}
		for(let p = 1; p < this.currentIndex; p++){
			if(this.dataHandler.myWidgets[p][1] > 0) {
				return p;
			}
		}

		return this.currentIndex;
		
	}

	fillPowerUpBoard(p: PowerUpButton, index: number){
		if((index >= 0) && (index <= 8))
		{
			this.powerBoard[index] = p;
		}
	}

	findPreviousIndex(): number{
		if(this.currentIndex > 1) {
			for(let p = this.currentIndex-1; p >= 1; p--){
				if(this.dataHandler.myWidgets[p][1] > 0){
					return p;
				}
			}
		}
		for(let i = this.dataHandler.myWidgets.length-1; i > this.currentIndex; i--) {
			if(this.dataHandler.myWidgets[i][1] > 0){
				return i;
			}
		}

		return this.currentIndex;
	}

	scrollForward(){
		let r = 0;
		r = this.findNextIndex();
		if(r != this.currentIndex) {
			this.currentWidgetButton.destroy();
			this.currentWidgetButton = new PowerUpButton(this, UpgradeScene.WIDGET_DISPLAY_POSITION[0], UpgradeScene.WIDGET_DISPLAY_POSITION[1], 
				this.pHandler.getColor(r), this.descriptions[r][0], 0, r);
			if(this.dataHandler.myWidgets[r][2] >= this.dataHandler.myWidgets[r][1]) {
				this.currentWidgetButton.veil();
			}
			this.add.existing(this.currentWidgetButton);
			this.descriptionText.setText(this.descriptions[this.currentWidgetButton.pType][1]);
			this.titleText.setColor(this.getColorFromColor(this.currentWidgetButton.color));
			this.titleText.setText(this.descriptions[this.currentWidgetButton.pType][2]);
			this.titleText.setOrigin(0.5, 0.5);
			this.currentIndex = r;
		}
	}

	scrollBackward(){
		let r = 0;
		r = this.findPreviousIndex();
		if(r != this.currentIndex) {
			this.currentWidgetButton.destroy();
			this.currentWidgetButton = new PowerUpButton(this, UpgradeScene.WIDGET_DISPLAY_POSITION[0], UpgradeScene.WIDGET_DISPLAY_POSITION[1], 
				this.pHandler.getColor(r), this.descriptions[r][0], 0, r);
			if(this.dataHandler.myWidgets[r][2] >= this.dataHandler.myWidgets[r][1]) {
				this.currentWidgetButton.veil();
			}
			this.add.existing(this.currentWidgetButton);
			this.descriptionText.setText(this.descriptions[this.currentWidgetButton.pType][1]);
			this.titleText.setColor(this.getColorFromColor(this.currentWidgetButton.color));
			this.titleText.setText(this.descriptions[this.currentWidgetButton.pType][2]);
			this.titleText.setOrigin(0.5, 0.5);
			this.currentIndex = r;
		}
	}

	splitButton(p: PowerUpButton){
		this.currentWidgetButton = new PowerUpButton(this, UpgradeScene.WIDGET_DISPLAY_POSITION[0], UpgradeScene.WIDGET_DISPLAY_POSITION[1], 
		p.color, this.descriptions[p.pType][0], 0, p.pType);
		this.add.existing(this.currentWidgetButton);
		this.takeWidget(p.pType);
		const pointer = this.input.activePointer;
		p.x = pointer.x;
		p.y = pointer.y;
		this.currentPowerUpButtons.push(p);
	}

	takeWidget(index: number){
		if(this.dataHandler.myWidgets[index][2] >= this.dataHandler.myWidgets[index][1]){
			return;
		}
		this.dataHandler.takeWidget(index);
		if(this.dataHandler.myWidgets[index][2] >= this.dataHandler.myWidgets[index][1]){
			this.currentWidgetButton.veil();
		}
	}

	returnWidget(index: number){
		if(this.dataHandler.myWidgets[index][2] <= 0){
			return;
		}
		if(index == powerID.NULL){
			return;
		}
		this.dataHandler.returnWidget(index);
		if(this.dataHandler.myWidgets[index][2] < this.dataHandler.myWidgets[index][1]){
			if(this.currentWidgetButton.veiled && (this.currentIndex == index)) {
				this.currentWidgetButton.unveil();
			}
		}
	}

	finalize(){
		console.log("buttons to process");
		console.log(this.powerBoard);
		this.dataHandler.applyTable(this.powerBoard);
	}

	checkReqs(): boolean{

		if((this.requireWidget >= 0) && (this.requireWidget < this.descriptions.length)){
			//if(this.pHandler.)
			let rx = false;
			for(let nn = 0; nn < this.powerBoard.length; nn++){
				if(this.powerBoard[nn] != null){
					if(this.powerBoard[nn].pType == this.requireWidget){
						//console.log("REQUIRED WIDGET PRESENT: " + this.requireWidget);
						rx = true;
					}
				}
			}
			//console.log("REQUIRED WIDGET NOT PRESENT: " + this.requireWidget);
			return rx;
		} else {
			//console.log("NO WIDGET REQUIRED / OOB");
			return true;
		}

	}

	flash(){
		if((this.requireWidget >= 0) && (this.requireWidget < this.descriptions.length)){
			this.flashTimer = 1000;
			this.alertText.setText("REQUIRED: " + this.descriptions[this.requireWidget][2] + "!");
		} else {
			this.flashTimer = 0;
			this.requireWidget = -1;
		}

	}

	nextScene(): void{
		
		if(this.checkReqs()){
			this.dataHandler.nextReqWidget = -1;
			this.requireWidget = -1;
			this.endStage();
		} else {
			this.flash();
		}

	}

	endStage(){
		this.cleanRemainingWidgets();
		this.finalize();
		this.scene.start("GameScene", {gameData: this.dataHandler});
	}

	cleanRemainingWidgets(){
		for(let i = 0; i < this.currentPowerUpButtons.length; i++)
		{
			if((!this.currentPowerUpButtons[i].snapped) && (!this.currentPowerUpButtons[i].deleteFlag)) {
				this.returnWidget(this.currentPowerUpButtons[i].pType);
				this.currentPowerUpButtons[i].deleteFlag = true;
			}
		}
	}

	recalculateBingos()
	{
		this.bingoMap = this.pHandler.calculateBingosByButton(this.powerBoard);
		let v = 0;
		v = this.bingoMap.get(pColor.GRAY)!
		if(v > 0)
		{
			this.grayBingoText.setText(" Gray Bingo x " + v + " : " + (1+v) + " round burst!");
			this.bingoStates[0] = true;
		} else {
			this.grayBingoText.setText("");
			this.bingoStates[0] = false;
		}

		v = this.bingoMap.get(pColor.RED)!
		if(v > 0)
		{
			this.redBingoText.setText(" Red Bingo x " + v + " : + " + Math.round(100*(v*0.15)) + " % crit damage!");
			this.bingoStates[1] = true;
		} else {
			this.redBingoText.setText("");
			this.bingoStates[1] = false;
		}
		
		v = this.bingoMap.get(pColor.BLUE)!
		if(v > 0)
		{
			this.blueBingoText.setText(" Blue Bingo x " + v + " : + " + (1+(2*v)) + " pellet flak shots!");
			this.bingoStates[2] = true;
		} else {
			this.blueBingoText.setText("");
			this.bingoStates[2] = false;
		}
		
		v = this.bingoMap.get(pColor.GOLD)!
		if(v > 0)
		{
			this.goldBingoText.setText(" Gold Bingo x " + v + " : + " + Math.round(100*(v*0.5)) + " % on-hit damage!");
			this.bingoStates[3] = true;
		} else {
			this.goldBingoText.setText("");
			this.bingoStates[3] = false;
		}

		v = this.bingoMap.get(pColor.RAINBOW)!
		if(v > 0)
		{
			this.rainbowBingoText.setText(" Rainbow Bingo x " + v + " : +" + v + " extra lives per stage!");
			this.bingoStates[4] = true;
		} else {
			this.rainbowBingoText.setText("");
			this.bingoStates[3] = false;
		}

	}

	getColorFromColor(n: number): string{
		switch(n) {
			case pColor.GRAY: {
				return "#DCDCDC";
				break;
			} case pColor.RED: {
				return "#FF0000";
				break;
			} case pColor.BLUE: {
				return "#0000FF";
				break;
			} case pColor.GOLD: {
				return 	"#FFFF00";
				break;
			} case pColor.RAINBOW: {
				return 	"#F5FFFA"
				break;
			}
		}
		return "#FFFFFF";
	}

	updateWidgetEffectSpawner(){

	}

	addWidgetEffect(b: BasicEffect){
		this.widgetEffects.push(b);
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
