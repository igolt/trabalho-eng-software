import { Scene } from "../scene.js";
export class CanvasScene extends Scene {
    constructor(id, context) {
        super(id);
        this.context = context;
    }
}
