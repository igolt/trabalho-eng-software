import { Sprite } from "../src/Sprite.js";

export class Player extends Sprite{
    constructor(params = {}) {
        super(params);

    const defaultParams = {
        x: 120,
        y: 540,
        vx: 20,
        vy: 20,
        ax: 0,
        ay: 0,
        height: 24,
        width: 24,
        a: 0,
        va: 0,

        vida: 5,
        hitCooldown: 0,
        pulo: 0,
        morto: 0,

        frame: 0,
        side: 1,
        modelX: 0,
        modelY: 1,

        props: {tipo: "pc"},
        color: "blue",
        behave: undefined,
        scene: undefined,
      };

      Object.assign(this, defaultParams, params);
    }

    resethitCooldown(dt){
        this.hitCooldown -= dt;
        if (this.hitCooldown < -1) {
            this.hitCooldown = 0;
        }
    }

    verificaDrawVida(dt){
        if (this.vida >= 3 && this.vida <= 5){
            this.modelX = 0;
        }
        else if (this.vida === 2){
            this.modelY = 0;
            this.modelX = 1;
        }
        else if (this.vida === 1){
            this.modelX = 0;
            this.modelY = 0;
        }
        else{
            this.modelX = 1;
            this.modelY = 1;
            this.morto = 1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.vx >= 0) {
          var F = Math.floor((this.frame * this.vx) / 30);
        } else {
          var F = Math.floor((this.frame * -1 * this.vx) / 30);
        }

        //WARN: for collision tests
        //ctx.fillStyle = "black";
        //ctx.fillRect(0, 0, this.width, this.height);

        this.verificaDrawVida();

        if(this.hitCooldown > 1){
            ctx.globalAlpha = 0.5;
        }
        else{
            ctx.globalAlpha = 1;
        }
        ctx.drawImage(
            this.scene.assets.image("bear"),
            (F % 2) * 16 + this.modelX * 32,
            Math.floor(this.side) * 16 + this.modelY * 32,
            16,
            16,
            0,
            0,
            this.width,
            this.height
        );

        ctx.restore();
    }

    move(dt) {
        this.frameControl(dt);
        this.resethitCooldown(dt);

        this.a = this.a + this.va * dt;
        this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
        this.vy = this.vy + 980 * dt;

        //calcula o indice atual na matriz baseado na posição atual do sprite
        this.mapCurrentIndexX = Math.floor(this.x / this.scene.map[this.scene.mapindice].SIZE);
        this.mapCurrentIndexY = Math.floor(this.y / this.scene.map[this.scene.mapindice].SIZE);
        if(this.scene.map[this.scene.mapindice].mapAssets.progress() >= 100){
          this.applyMapRestrictions(dt);
        }
        this.cooldown = this.cooldown - dt;
    }

}