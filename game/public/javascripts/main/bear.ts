import { BodyR2 } from "../body.js";
import { IR2 } from "../ir2.js";
import { ISpaceR2, SpaceR2 } from "../space.js";
import { IImages } from "./images.js";

export class Bear extends BodyR2<string>{

    constructor(
        position: IR2,
        dimension: IR2,
        context: CanvasRenderingContext2D,
        images:IImages) {
        super("bear", position, dimension, new SpaceR2("bear",position, dimension));
    }

    show(): void {

        throw new Error("Method not implemented.");

    }

}