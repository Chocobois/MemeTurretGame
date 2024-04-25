import { GameScene } from "@/scenes/GameScene";

export enum pColor {
    GRAY = 11,
    RED = 111,
    BLUE = 1111,
    GOLD = 11111,
    RAINBOW = 0,
    NULL = -1,
}

export class PowerUp {
    public color: number;
    public ID: number;
    public iterations: number;
    public value: number[];

    constructor(ID: number, value: number[], color: number, iterations: number = 1) {
        this.ID = ID;
        this.value = value;
        this.color = color;
        this.iterations = iterations;
    }
}