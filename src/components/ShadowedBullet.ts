import { EnemyProjectile } from "./EnemyProjectile";
import { GameScene } from "@/scenes/GameScene";
import { EnemyBulletParam } from "./EnemyProjectile";
import { Turret } from "./Turret";

export class ShadowedBullet extends EnemyProjectile {
    public valence: number = 0;
    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, val: number){
        super(scene,x,y,angle,info);
        this.valence = val;
    }

    hitCheck(target: Turret): boolean {
        if(this.hasHit) {
            return false;
        }
        if((this.valence == 0) && this.scene.shadowed) {
            return false;
        } else if((this.valence == 1) && (!this.scene.shadowed)) {
            return false;
        }
        if(!this.info.useBox) {
            return (Math.hypot(this.x-target.x, this.y-target.y) < (this.info.radius+target.radius));
        } else {
            return this.boxCollide(this.scene.activeTurret);
        }
    }

    update(d: number) {
        super.update(d);
        if((this.valence == 0) && this.scene.shadowed) {
            this.mySprite.setAlpha(0.25);
        } else if((this.valence == 1) && (!this.scene.shadowed)) {
            this.mySprite.setAlpha(0.4);
        } else {
            this.mySprite.setAlpha(1);
        }
    }
}