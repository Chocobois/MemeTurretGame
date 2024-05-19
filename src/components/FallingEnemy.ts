import { Enemy } from "./Enemy";
import { GameScene } from "@/scenes/GameScene";
import { Turret } from "./Turret";
import { TextEffect } from "./TextEffect";
import { BasicEffect } from "./BasicEffect";
import { EnemyProjectile } from "./EnemyProjectile";

export class FallingEnemy extends Enemy {
    public spinSpeed: number = 0;
    public dmg: number = 666;
    constructor(scene:GameScene,x:number,y:number,type:number=0){
        super(scene,x,y,type);
        this.spinSpeed = 60+(120*Math.random());
        if(Math.random() <= 0.5) {
            this.spinSpeed *= -1;    
        }
        this.mySprite.setScale(0.5,0.5);
    }

    update(d: number, t: number){
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }
        this.updateAngle();
        this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }
        this.setAngle(this.angle+this.spinSpeed*d/1000);
        if(Math.hypot(this.scene.activeTurret.x-this.x, this.scene.activeTurret.y-this.y) < (this.myInfo.radius+this.scene.activeTurret.radius)) {
            this.crash(this.scene.activeTurret);
        } else if(this.y > 1080){
            this.boom();
        }
    }

    die(){
        let na = Math.random()*360;
        for(let dp = 0; dp < 4; dp++) {
            this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,na*(Math.PI/180),this.getBulletType(7)));
            na+=(360/4);
        }
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }
    
    boom(){
        let na = Math.random()*360;
        for(let dp = 0; dp < 20; dp++) {
            this.scene.addEnemyProjectile(new EnemyProjectile(this.scene,this.x,this.y,na*(Math.PI/180),this.getBulletType(7)));
            na+=(360/20);
        }
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }

    crash(t: Turret){
        this.scene.sound.play(this.deadSound, {volume:0.25});
        this.scene.sound.play("crit");
        t.takeDamage(this.dmg);
        this.scene.addTextEffect(new TextEffect(this.scene, t.x-30+(Math.random()*60), t.y-50+(Math.random()*100), Math.round(this.dmg)+" !", "aqua", 75, true, "fuchsia"));
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.deleteFlag = true;
    }
}