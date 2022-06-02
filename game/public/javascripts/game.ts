import { IPlayer } from "./player.js";
import { IGameStatus } from "./gamestatus.js";
import { IPhase } from "./phase.js";
import { IScene } from "./scene.js";

export interface IGame<ID>{

    id:ID;

    next(): IScene<ID> | undefined;
    previous(): IScene<ID> | undefined;
    begin(): void;
    end(): void;

    currentPhaseId():ID | undefined;
    currentSceneryId():ID | undefined;

}

export class Game<ID> implements IGame<ID>{

    index:number = 0;

    constructor(public id:ID, private phases:IPhase<ID>[]){ }
    
    currentSceneryId(): ID | undefined {
        if(this.index > -1 && this.index < this.phases.length){
            return this.phases[this.index].currentSceneryId();
        }
        return undefined;
    }

    currentPhaseId(): ID  | undefined{
         if(this.index > -1 && this.index < this.phases.length){
            return this.phases[this.index].id;
        }
        return undefined;
    }

    next(): IScene<ID>  | undefined{

        if(this.index < 0) this.index = 0;

        for (; this.index < this.phases.length; this.index++) {
            
            let scene = this.phases[this.index].next();

            if (scene !== undefined) {

                return scene;

            }
            
        }

        return undefined;
    }

    previous(): IScene<ID>  | undefined{

        if(this.index >= this.phases.length) this.index = this.phases.length - 1;

        for (; this.index > -1; this.index--) {
            
            let scene = this.phases[this.index].previous();

            if (scene !== undefined) {

                return scene;

            }
            
        }

        return undefined;
    }

    begin(): void {
        this.index = 0;
        for (const phase of this.phases) {
            phase.begin();
        }
    }

    end(): void {
        this.index = this.phases.length - 1;
        for (const phase of this.phases) {
            phase.end();
        }
    }
   

}