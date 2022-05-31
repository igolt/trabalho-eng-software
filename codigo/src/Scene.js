export class Scene {
  constructor(params = {}) {
    let defaultParams = {
      sprites: [],
      toRemove: [],
      ctx: null,
      width: 300,
      height: 300,
      assets: null,
      map: null,
      mapindice: 0,
      teleportes: 0,
      set: 0,
    };
    Object.assign(this, defaultParams, params);
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
    sprite.setScene(this);
  }

  drawBackground() {
    this.map[this.mapindice].drawBackground(this.ctx)
  }

  drawMapa() {
    this.map[this.mapindice].draw(this.ctx);
  }

  draw() {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }

  drawSprites() {
    this.drawBackground();
    this.drawMapa();
    this.draw();
  }

  move(dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].move(dt);
    }
  }

  behave() {
    for (var i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].behave) {
        this.sprites[i].behave();
      }
    }
  }

  clearScene() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.h);
  }

  checkCollision() {
    for (var i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].vida <= 0) {
        this.sprites[i].morto = 1;
      }
      for (var j = i + 1; j < this.sprites.length; j++) {
        if (this.sprites[i].checkCollision(this.sprites[j])) {
          console.log("colidiu");
        }
      }
    }
  }

  removeSprites() {
    for (var i = 0; i < this.toRemove.length; i++) {
      var idx = this.sprites.indexOf(this.toRemove[i]);
      if (idx >= 0) {
        this.sprites.splice(idx, 1);
      }
    }
    this.toRemove = [];
  }

  // WARN: Esse método não está sendo chamado
  limpezaSprites() {
    for (var i = 0; i < this.sprites.length; i++) {
      if (
        this.sprites[i].props.tipo != "pc" &&
        this.sprites[i].props.tipo != "bearrider"
      ) {
        this.toRemove.push(this.sprites[i]);
      }
    }
  }

  step(dt) {
    // this.clearScene();
    this.drawSprites();
    this.behave();
    this.move(dt);
    this.checkCollision();
    this.removeSprites();
  }
}
