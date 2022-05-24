function Sprite(params = {}) {
    var exemplo = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        h: 10,
        w: 10,
        a: 0,
        va: 0,
        vm: 0,
        vida: 500,
        pulo: 0,
        morto: 0,
        comportamentoativo: 0,
        rate: 0,
        lado: 1,
        frame: 0,
        modelo: 1,
        shadow: 0,
        spawn: {},
        props: {},
        cooldown: 0,
        color: "blue",
        comportar: undefined,
        scene: undefined
    }
    Object.assign(this, exemplo, params);
}

Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.desenhar = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.vx >= 0) {
        var F = Math.floor(this.frame * this.vx/30);
    }
    else {
        var F = Math.floor(this.frame * (-1) * this.vx/30);
    }

    //pc
    if(this.props.tipo === "pc"){
        ctx.drawImage(this.scene.assets.img("bear"),
        F%2 * 16 + (this.modelo * 32),
        Math.floor(this.lado) * 16 + (this.shadow * 32),
        16,
        16,
        -this.w/2,
        -this.h/2,
        this.w,
        this.h
        );
        //vida
        ctx.fillStyle = 'red';
        ctx.fillRect(-this.vida/8, 16, this.vida/4, 2);
        ctx.fillStyle = 'black';
        ctx.font = "16px bold Aldrich";
        ctx.fillText(this.vida, -this.vida/8, 16, this.vida/4, 2);
    }
    else if(this.props.tipo === "enemy" ){
        ctx.fillRect(0, 0, 32, 32);
        ctx.drawImage(this.scene.assets.img("charger"),
        F%2 * 32,
        Math.floor(this.lado) * 32,
        32,
        32,
        -this.w/2,
        -this.h,
        this.w*2,
        this.h*2
       );
       ctx.fillStyle = 'darkred';
       ctx.fillRect(-this.vida/2, 48, this.vida, 4);
       ctx.fillStyle = 'black';
    }
    ctx.restore();
}



Sprite.prototype.mover = function (dt) {
    this.a = this.a + this.va*dt;
    this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
    if(this.props.tipo != 'pc')
        this.vy = this.vy + this.ay * dt + 980 * dt;
    else
        this.vy = this.vy + 980 * dt;

    this.mc = Math.floor(this.x / this.scene.map[this.scene.mapindice].SIZE);
    this.ml = Math.floor(this.y / this.scene.map[this.scene.mapindice].SIZE);

    this.aplicaRestricoesMapa(dt);
    this.cooldown = this.cooldown - dt;

}
Sprite.prototype.aplicaRestricoesMapa = function (dt) {
    var dnx;
    var dx;
    dx = this.vx * dt;
    dnx = dx;
    dy = this.vy * dt;
    dny = dy;
    if (dx > 0 && this.scene.map[this.scene.mapindice].cells[this.mc + 1][this.ml].tipo != 0) {
        dnx = this.scene.map[this.scene.mapindice].SIZE * (this.mc + 1) - (this.x + this.w / 2);
        dx = Math.min(dnx, dx);
    }
    if (dx < 0 && this.scene.map[this.scene.mapindice].cells[this.mc - 1][this.ml].tipo != 0) {
        dnx = this.scene.map[this.scene.mapindice].SIZE * (this.mc - 1 + 1) - (this.x - this.w / 2);
        dx = Math.max(dnx, dx);
    }
    if (dy > 0 && this.scene.map[this.scene.mapindice].cells[this.mc][this.ml + 1].tipo != 0) {
        dny = this.scene.map[this.scene.mapindice].SIZE * (this.ml + 1) - (this.y + this.h / 2);
        dy = Math.min(dny, dy);
    }
    if (dy < 0 && this.scene.map[this.scene.mapindice].cells[this.mc][this.ml - 1].tipo != 0) {
        dny = this.scene.map[this.scene.mapindice].SIZE * (this.ml - 1 + 1) - (this.y - this.h / 2);
        dy = Math.max(dny, dy);
    }
    this.vy = dy / dt;
    this.x = this.x + dx;
    this.y = this.y + dy;

    var MAXX = this.scene.map[this.scene.mapindice].SIZE * this.scene.map[this.scene.mapindice].COLUMNS - this.w / 2;
    var MAXY = this.scene.map[this.scene.mapindice].SIZE * this.scene.map[this.scene.mapindice].LINES - this.h / 2;

    if (this.x > MAXX) this.x = MAXX;
    if (this.y > MAXY) {
        this.y = MAXY;
        this.vy = 0;
    }
    if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
    if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;

}
Sprite.prototype.colidiuCom = function (alvo) {
    if (alvo.x + alvo.w / 2 < this.x - this.w / 2) return false;
    if (alvo.x - alvo.w / 2 > this.x + this.w / 2) return false;

    if (alvo.y + alvo.h / 2 < this.y - this.h / 2) return false;
    if (alvo.y - alvo.h / 2 > this.y + this.h / 2) return false;

    return true;
}