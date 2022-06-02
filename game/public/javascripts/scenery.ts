import { IScene } from "./scene.js";

export interface IScenery<ID> {
    id:ID;
    next(): IScene<ID> | undefined;
    previous():IScene<ID> | undefined;
    begin():void;
    end():void;
}

export class Scenery<ID> implements IScenery<ID>{

    index: number = -1;

    constructor(
        public id:ID,
        private scenes: IScene<ID>[]) { }

    begin(): void{
        this.index = -1;
    }

    end(): void {
        this.index = this.scenes.length;
    }

    next(): IScene<ID> | undefined {

        this.index++;

        if (this.index < this.scenes.length) {

            return this.scenes[this.index];

        } 

        return undefined;

    }

    previous(): IScene<ID> | undefined {

        this.index--;

        if (this.index > -1) {

            return this.scenes[this.index];

        } 

        return undefined;

    }

}