import { IIdentifiable } from "./IIdentifiable.js";
import { IR2 } from "./ir2.js";


export interface ISpaceR2<ID> extends IIdentifiable<ID> {
    position: IR2;
    dimension: IR2;
}

export class SpaceR2<ID> implements ISpaceR2<ID> {

    constructor(
        public id:ID,
        public position: IR2,
        public dimension: IR2) { }

}


