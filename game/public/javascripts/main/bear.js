import { BodyR2 } from "../body.js";
import { SpaceR2 } from "../space.js";
export class Bear extends BodyR2 {
    constructor(position, dimension, context, images) {
        super("bear", position, dimension, new SpaceR2("bear", position, dimension));
    }
    show() {
        throw new Error("Method not implemented.");
    }
}
