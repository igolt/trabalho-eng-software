import { Sprite } from "../src/Sprite.js";

export class EnemyDino extends Sprite{
    constructor(params = {}) {
        super(params);

    const defaultParams = {
        x: 0,
        y: 0,
        vx: 20,
        vy: 20,
        ax: 0,
        ay: 0,
        height: 32,
        width: 32,
        a: 0,
        va: 0,

        vida: 5,
        pulo: 0,
        morto: 0,

        frame: 0,
        side: 1,
        modelX: 0,
        modelY: 1,

        props: {tipo: "pc"},
        color: "blue",
        target: this.setNewTarget(this),
        behave: this.behaviour,
        scene: undefined,
      };

      Object.assign(this, defaultParams, params);
    }

    setNewTarget(newTarget){
      this.target = newTarget;
    }

    behaviour () {
      let distVetorial = Math.sqrt((this.target.x - this.x) * (this.target.x - this.x) + (this.target.y - this.y) * (this.target.y - this.y))
      if (distVetorial <= 200) {
        if (this.target.x <= this.x) {
          this.side = 0;
        } else {
          this.side = 1;
        }
        this.ax = 200 * Math.sign(this.target.x - this.x);
      }
    };

    frameControl(dt){
      this.frame += 0.01 * dt;
      if (Math.floor(this.frame) >= 20) {
          this.frame = 0;
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

        ctx.drawImage(
            this.scene.assets.image("charger"),
            (F % 2) * 32,
            this.side * 32,
            32,
            32,
            0,
            0,
            this.width,
            this.height
        );

        ctx.restore();
    }

}