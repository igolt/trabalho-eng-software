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
      scenePlayer: null
    };
    Object.assign(this, defaultParams, params);
  }

  addSprite(sprite) {
    sprite.setScene(this);
    this.sprites.push(sprite);
  }

  addEnemySprites(enemysprite) {
    for (var i = 0; i < enemysprite.length; i++) {
      enemysprite[i].setNewTarget(this.scenePlayer);
      enemysprite[i].setScene(this);
      this.sprites.push(enemysprite[i]);
    }
    console.log(this.sprites)
  }

  drawMapa() {
    if(this.set != 1){
      this.addEnemySprites(this.map[this.mapindice].enemies)
      this.set = 1;
    }
    this.map[this.mapindice].draw(this.ctx);
  }

  draw() {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }

  drawSprites() {
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

  checkCollision() {
    for (var i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].vida <= 0) {
        this.sprites[i].morto = 1;
      }
      for (var j = i + 1; j < this.sprites.length; j++) {
        if (this.sprites[i].checkCollision(this.sprites[j])) {
          if(this.sprites[i].props.tipo === "pc" && this.sprites[i].hitCooldown <= 0){
            console.log(this.sprites[i].hitCooldown)
            this.sprites[i].vida--;
            this.sprites[i].hitCooldown = 3;
            console.log("colidiu");
          }
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

  step(dt) {
    this.drawSprites();
    this.behave();
    this.move(dt);
    this.checkCollision();
    this.removeSprites();
  }
}
