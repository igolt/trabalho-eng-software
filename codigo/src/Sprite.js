export class Sprite {
  constructor(params = {}) {
    const defaultParams = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      height: 10,
      width: 10,
      a: 0,
      va: 0,
      pulo: 0,
      frame: 0,
      spawn: {},
      props: {},
      color: "blue",
      behave: undefined,
      scene: undefined,
    };

    Object.assign(this, defaultParams, params);
  }

  setScene(scene) {
    this.scene = scene;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.vx >= 0) {
      var F = Math.floor((this.frame * this.vx) / 30);
    } else {
      var F = Math.floor((this.frame * -1 * this.vx) / 30);
    }
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  frameControl(dt){
    this.frame += 16 * dt;
    if (Math.floor(this.frame) >= 20) {
        this.frame = 0;
    }
  }

  move(dt) {
    this.frameControl(dt);

    this.a = this.a + this.va * dt;
    this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
    this.vy = this.vy + this.ay * dt + 980 * dt;

    //calcula o indice atual na matriz baseado na posição atual do sprite
    this.mapCurrentIndexX = Math.floor(this.x / this.scene.map[this.scene.mapindice].SIZE);
    this.mapCurrentIndexY = Math.floor(this.y / this.scene.map[this.scene.mapindice].SIZE);
    if(this.scene.map[this.scene.mapindice].mapAssets.progress() >= 100){
      this.applyMapRestrictions(dt);
    }
    this.cooldown = this.cooldown - dt;
  }

  applyMapRestrictions(dt) {

    //direção e tamanho do passo
    let dx = this.vx * dt;
    let dy = this.vy * dt;

    //direnção e tamanho do next passo
    let dNextX = dx;
    let dNextY = dy;

    //próxima cell em X
    let proxCellX = this.scene.map[this.scene.mapindice].cells[this.mapCurrentIndexX + 1][this.mapCurrentIndexY].tipo;
    //anterior cell em X
    let antCellX = this.scene.map[this.scene.mapindice].cells[this.mapCurrentIndexX - 1][this.mapCurrentIndexY].tipo;
    //próxima cell em Y
    let proxCellY =  this.scene.map[this.scene.mapindice].cells[this.mapCurrentIndexX][this.mapCurrentIndexY + 1].tipo;
    //anterior cell em Y
    let antCellY = this.scene.map[this.scene.mapindice].cells[this.mapCurrentIndexX][this.mapCurrentIndexY - 1].tipo;

    //indo direita
    if (dx > 0 && proxCellX != 0) {
      if(proxCellX == 2){
        this.scene.mapindice++;
        this.x = this.scene.map[this.scene.mapindice].SIZE * 3;
        this.scene.set = 0;
      }
      //força o sprite a retornar pra esquerda
      dNextX = this.scene.map[this.scene.mapindice].SIZE * (this.mapCurrentIndexX + 1) - (this.x + this.width);
      dx = Math.min(dNextX, dx);
    }

    //indo esquerda
    if (dx < 0 && antCellX != 0) {
      if(antCellX == 2){
        this.scene.mapindice--;
        this.x = this.scene.map[this.scene.mapindice].SIZE * (this.scene.map[this.scene.mapindice].COLUMNS - 3);
        this.scene.set = 0;
      }
      //força o sprite a retornar pra direita
      dNextX = this.scene.map[this.scene.mapindice].SIZE * (this.mapCurrentIndexX) - (this.x);
      dx = Math.max(dNextX, dx);
    }

    //indo baixo
    if (dy > 0 && proxCellY!= 0) {
      //força o sprite a retornar pra cima
      dNextY = this.scene.map[this.scene.mapindice].SIZE * (this.mapCurrentIndexY + 1) - (this.y + this.height);
      dy = Math.min(dNextY, dy);
      this.pulo = 0;
    }

    //indo cima
    if (dy < 0 && antCellY != 0) {
      //força o sprite a retornar pra baixo
      dNextY = this.scene.map[this.scene.mapindice].SIZE * (this.mapCurrentIndexY) - (this.y);
      dy = Math.max(dNextY, dy);
    }

    this.vy = dy / dt;
    this.x = this.x + dx;
    this.y = this.y + dy;

  }

  checkCollision(alvo) {
    if (alvo.x + alvo.width / 2 < this.x - this.width / 2) return false;
    if (alvo.x - alvo.width / 2 > this.x + this.width / 2) return false;

    if (alvo.y + alvo.h / 2 < this.y - this.height / 2) return false;
    if (alvo.y - alvo.h / 2 > this.y + this.height / 2) return false;

    return true;
  }
}
