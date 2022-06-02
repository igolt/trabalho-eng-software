import { Scene } from "../scene.js";

export class CanvasScene extends Scene<string>{
    constructor(id:string, protected context:CanvasRenderingContext2D){
        super(id);
    }
}