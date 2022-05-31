import { IDrawable } from "./drawable";
import { IScene } from "./scene";

export interface ISprite extends IDrawable {

    scene: IScene;
    vida: number,
    pulo: number,
    morto: number,
    x: number;
    y: number;
    w: number;
    h: number;
    props: { tipo: string },
    move(dt: number): void;
    colidiuCom(alvo: ISprite);

}

export class Sprite implements ISprite {

    mc:number = 0;
    ml:number = 0;
    vx: number =0;
    vy: number =0;
    ax: number =0;
    ay: number =0;
    a: number =0;
    va: number =0;
    vm: number =0;
    vida: number =500;
    pulo: number =0;
    morto: number =0;
    comportamentoativo: number =0;
    rate: number =0;
    lado: number =1;
    frame: number =0;
    modelo: number =1;
    shadow: number =0;
    spawn: {};
    props: { tipo: string };
    cooldown: number;
    color: "blue";
    comportar: undefined;
    scene: IScene;


    constructor(public x:number, public y:number, public w:number, public h:number, props: { tipo: string }, vida: number){ }


    move(dt: number): void { }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.vx >= 0) {
            var F = Math.floor(this.frame * this.vx / 30);
        }
        else {
            var F = Math.floor(this.frame * (-1) * this.vx / 30);
        }

        //pc
        if (this.props.tipo === "pc") {
            ctx.drawImage(this.scene.assets.img("bear"),
                F % 2 * 16 + (this.modelo * 32),
                Math.floor(this.lado) * 16 + (this.shadow * 32),
                16,
                16,
                -this.w / 2,
                -this.h / 2,
                this.w,
                this.h
            );
            //vida
            ctx.fillStyle = 'red';
            ctx.fillRect(-this.vida / 8, 16, this.vida / 4, 2);
            ctx.fillStyle = 'black';
            ctx.font = "16px bold Aldrich";
            ctx.fillText(this.vida.toString(), -this.vida / 8, 16, this.vida / 4);
        }
        else if (this.props.tipo === "enemy") {
            ctx.fillRect(0, 0, 32, 32);
            ctx.drawImage(this.scene.assets.img("charger"),
                F % 2 * 32,
                Math.floor(this.lado) * 32,
                32,
                32,
                -this.w / 2,
                -this.h,
                this.w * 2,
                this.h * 2
            );
            ctx.fillStyle = 'darkred';
            ctx.fillRect(-this.vida / 2, 48, this.vida, 4);
            ctx.fillStyle = 'black';
        }
        ctx.restore();
    }


    mover(dt:number) {
        this.a = this.a + this.va*dt;
        this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
        if(this.props.tipo != 'pc')
            this.vy = this.vy + this.ay * dt + 980 * dt;
        else
            this.vy = this.vy + 980 * dt;
    
        this.mc = Math.floor(this.x / this.scene.maps[this.scene.mapindice].SIZE);
        this.ml = Math.floor(this.y / this.scene.maps[this.scene.mapindice].SIZE);
    
        this.aplicaRestricoesMapa(dt);
        this.cooldown = this.cooldown - dt;
    
    }

    aplicaRestricoesMapa(dt:number) {
        var dnx;
        var dx;
        dx = this.vx * dt;
        dnx = dx;
        var dy = this.vy * dt;
        var dny = dy;
        if (dx > 0 && this.scene.maps[this.scene.mapindice].cells[this.mc + 1][this.ml] != 0) {
            dnx = this.scene.maps[this.scene.mapindice].SIZE * (this.mc + 1) - (this.x + this.w / 2);
            dx = Math.min(dnx, dx);
        }
        if (dx < 0 && this.scene.maps[this.scene.mapindice].cells[this.mc - 1][this.ml] != 0) {
            dnx = this.scene.maps[this.scene.mapindice].SIZE * (this.mc - 1 + 1) - (this.x - this.w / 2);
            dx = Math.max(dnx, dx);
        }
        if (dy > 0 && this.scene.maps[this.scene.mapindice].cells[this.mc][this.ml + 1] != 0) {
            dny = this.scene.maps[this.scene.mapindice].SIZE * (this.ml + 1) - (this.y + this.h / 2);
            dy = Math.min(dny, dy);
        }
        if (dy < 0 && this.scene.maps[this.scene.mapindice].cells[this.mc][this.ml - 1] != 0) {
            dny = this.scene.maps[this.scene.mapindice].SIZE * (this.ml - 1 + 1) - (this.y - this.h / 2);
            dy = Math.max(dny, dy);
        }
        this.vy = dy / dt;
        this.x = this.x + dx;
        this.y = this.y + dy;
    
        var MAXX = this.scene.maps[this.scene.mapindice].SIZE * this.scene.maps[this.scene.mapindice].COLUMNS - this.w / 2;
        var MAXY = this.scene.maps[this.scene.mapindice].SIZE * this.scene.maps[this.scene.mapindice].LINES - this.h / 2;
    
        if (this.x > MAXX) this.x = MAXX;
        if (this.y > MAXY) {
            this.y = MAXY;
            this.vy = 0;
        }
        if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
        if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;
    
    }

    colidiuCom(alvo: ISprite) {
        if (alvo.x + alvo.w / 2 < this.x - this.w / 2) return false;
        if (alvo.x - alvo.w / 2 > this.x + this.w / 2) return false;
    
        if (alvo.y + alvo.h / 2 < this.y - this.h / 2) return false;
        if (alvo.y - alvo.h / 2 > this.y + this.h / 2) return false;
    
        return true;
    }


}