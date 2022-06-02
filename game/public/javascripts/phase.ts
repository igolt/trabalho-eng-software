import { IScene } from "./scene.js";
import { IScenery } from "./scenery.js";

export interface IPhase<ID> {
    id: ID;
    next(): IScene<ID> | undefined;
    previous(): IScene<ID> | undefined;
    begin(): void;
    end(): void;
    currentSceneryId():ID | undefined;
}

export class Phase<ID> implements IPhase<ID>{

    index: number = 0;

    constructor(public id: ID, private sceneries: IScenery<ID>[]) { }

    currentSceneryId():ID | undefined {
        if(this.index > -1 && this.index < this.sceneries.length){
            return this.sceneries[this.index].id;
        }
        return undefined;
    }

    begin(): void {
        this.index = 0;
        for (const scenery of this.sceneries) {
            scenery.begin();
        }
    }

    end(): void {
        this.index = this.sceneries.length - 1;
        for (const scenery of this.sceneries) {
            scenery.end();
        }
    }

    previous(): IScene<ID>  | undefined {

        if(this.index >= this.sceneries.length) this.index = this.sceneries.length - 1;

        for (; this.index > -1; this.index--) {
            
            let scene = this.sceneries[this.index].previous();

            if (scene !== undefined) {

                return scene;

            }
            
        }

        return undefined;

    }

    next(): IScene<ID> | undefined {

        if(this.index < 0) this.index = 0;

        for (; this.index < this.sceneries.length; this.index++) {
            
            let scene = this.sceneries[this.index].next();

            if (scene !== undefined) {

                return scene;

            }
            
        }

        return undefined;

    }


}