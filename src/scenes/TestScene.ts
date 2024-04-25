import { BaseScene } from "@/scenes/BaseScene";

export class TestScene extends BaseScene{
    constructor() {
        super({ key: "TestScene" });
        let r = new Phaser.GameObjects.Container(this);
    }
}