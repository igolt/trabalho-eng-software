import { IAssetsManager } from "./assetsmanager";
import { IDrawable } from "./drawable";
import { ISceneMap } from "./scenemap";
import { ISprite, Sprite } from "./sprite";

export interface IScene extends IDrawable {

    assets: IAssetsManager;
    mapindice: number;
    maps: ISceneMap[];

}

export class Scene implements IScene {

    constructor(
        private sprites: ISprite[],
        public assets: IAssetsManager,
        public maps: ISceneMap[],
        private toRemove: ISprite[],
        public mapindice: number = 0,
        private canvasWidth: number = 300,
        private canvasHeigth: number = 300,
        private teleportes: number = 0,
        private set: number = 0,
    ) { }

    addSprite(sprite: ISprite) {
        this.sprites.push(sprite);
        sprite.scene = this;
    };

    draw(ctx: CanvasRenderingContext2D): void {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(ctx);
        }
    }

    desenharBackground(ctx: CanvasRenderingContext2D) {
        this.maps.push(this.maps[this.mapindice]);
        switch (this.maps[this.mapindice].mapindice) {
            case 0:
                ctx.drawImage(this.assets.img("background1"), 0, 0, 800, 640, 0, 0, this.canvasWidth, this.canvasHeigth);
                if (this.set <= 0.5) {
                    var npc = new Sprite(580, 540, 32, 32, { tipo: "enemy" }, 10);
                    this.addSprite(npc);
                    this.set = 1;
                }
                break;
        }
    }

    desenharMapa(ctx: CanvasRenderingContext2D) {
        this.maps[this.mapindice].draw(ctx);
    }

    desenharSprites(ctx: CanvasRenderingContext2D) {
        this.desenharBackground(ctx);
        this.desenharMapa(ctx);
        this.draw(ctx);
    }

    mover(dt:number) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].move(dt);
        }
    };

    limpar = function(ctx: CanvasRenderingContext2D){
        this.ctx.clearRect(0,0, this.w, this.h);
    }

    checaColisao(){
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

    removeSprites(){
        for (var i = 0; i < this.toRemove.length; i++) {
            var idx = this.sprites.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.sprites.splice(idx,1);
            }
        }
        this.toRemove = [];
    };
    

    limpezaSprites(){
        for(var i = 0; i<this.sprites.length; i++){
            if(this.sprites[i].props.tipo != "pc" &&
            this.sprites[i].props.tipo != "bearrider"){
                this.toRemove.push(this.sprites[i]);
            }
        }
    }
    
    passo(dt:number,ctx: CanvasRenderingContext2D){
        this.limpar(ctx);
        this.desenharSprites(ctx);
        // this.comportar();
        this.mover(dt);
        this.checaColisao();
        this.removeSprites();
    }

    // comportar(){
    //     for(var i = 0; i<this.sprites.length; i++){
    //         if(this.sprites[i].comportar){
    //             this.sprites[i].comportar();
    //         }
    //     }
    // };

}