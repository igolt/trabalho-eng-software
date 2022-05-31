import { IAssetsManager } from "./assetsmanager";
import { IDrawable } from "./drawable";

export interface ISceneMap extends IDrawable {
    draw(ctx: CanvasRenderingContext2D): void;
    SIZE: number;
    cells: number[][];
    LINES: number;
    COLUMNS: number;
    mapindice: number;
}

export class SceneMap implements ISceneMap {

    constructor(
        private mapAssets:IAssetsManager,
        public cells: number[][],
        public mapindice: number,
        public LINES: number = 32,
        public COLUMNS: number = 32,
        public SIZE: number = 32) { }

    draw(ctx: CanvasRenderingContext2D): void {
        // var cor = "black";
        for (var c = 0; c < this.COLUMNS; c++) {
            for (var l = 0; l < this.LINES; l++) {
                switch (this.cells[c][l]) {
                    //andavel
                    case 0:
                        break;

                    //solido
                    case 1:
                        break;
                    case 2:
                        ctx.drawImage(this.mapAssets.img("voidtile"), 0, 0, 16, 16, c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                        break;
                }
            }
        }
    }


}