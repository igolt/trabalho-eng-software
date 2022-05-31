function Scene(params) {
    var exemplo ={
        sprites: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        assets: null,
        map: null,
        mapindice: 0,
        teleportes: 0,
        set: 0,
        map: null,// ???
        mapindice: 0 // ???
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.adicionar = function(sprite){
    this.sprites.push(sprite);
    sprite.scene = this;
};


Scene.prototype.desenharBackground = function(){
    this.map.push(this.map[this.mapindice]);
    switch(this.map[this.mapindice].mapindice){
        case 0:
            ctx.drawImage(mapAssets.img("background1"), 0, 0, 800, 640, 0, 0, canvas.width, canvas.height);
            if(this.set <= 0.5){
                var npc = new Sprite({ x: 580, y: 540, w:32, h: 32, props: { tipo: "enemy" }, vida: 10, comportar: charge(pc)});
                cena.adicionar(npc);
                this.set = 1;
            }
            break;
    }
}
Scene.prototype.desenharMapa = function () {
    this.map[this.mapindice].desenhar(this.ctx);
}
Scene.prototype.desenhar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].desenhar(this.ctx);
    }
};


Scene.prototype.mover = function(dt){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].mover(dt);
    }
};

Scene.prototype.comportar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].comportar){
            this.sprites[i].comportar();
        }
    }
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
}

Scene.prototype.checaColisao = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].vida <=0){
            this.sprites[i].morto = 1;
        }
        for(var j = i+1; j<this.sprites.length; j++){
            if(this.sprites[i].colidiuCom(this.sprites[j])){
                console.log('colidiu');
            }
        }
    }
};


Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if(idx>=0){
            this.sprites.splice(idx,1);
        }
    }
    this.toRemove = [];
};

Scene.prototype.limpezaSprites = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].props.tipo != "pc" &&
        this.sprites[i].props.tipo != "bearrider"){
            this.toRemove.push(this.sprites[i]);
        }
    }
}

Scene.prototype.passo = function(dt){
    this.limpar();
    this.desenharSprites();
    this.comportar();
    this.mover(dt);
    this.checaColisao();
    this.removeSprites();
}