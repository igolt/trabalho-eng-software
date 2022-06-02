import { Fisical } from "../javascripts/fisical.js";
import { IR2 } from "../javascripts/ir2.js";
import { IShowable } from "../javascripts/showable.js";
import { ISpaceR2, SpaceR2 } from "../javascripts/space.js";
import { ITimed } from "../javascripts/timed.js";

export interface IBodyR2<ID> extends ITimed, ISpaceR2<ID>, IShowable {
    collisionArea?: SpaceR2<ID>;
    ifColliding(space: IBodyR2<ID>, r2: IR2):void;
    isColliding(is?:boolean):boolean;
}

export abstract class BodyR2<ID> extends SpaceR2<ID> implements IBodyR2<ID> {

    _isColliding:boolean = true;
    _isShowable:boolean = true;

    constructor(
        id:ID,
        public position: IR2,
        public dimension: IR2,        
        public collisionArea?: ISpaceR2<ID>,
        public acceleration: IR2 = { x: 0, y: 0 },
        public velocity: IR2 = { x: 0, y: 0 }) {
        super(id, position, dimension);
    }

    abstract show(): void;

    isShowable(is?: boolean | undefined): boolean {
        if(is){
            this._isShowable = is;
        }
        return this._isShowable;
    }

    isColliding(is?:boolean): boolean {
        if(is){
            this._isColliding = is;
        }
        return this._isColliding;
    }

    ifColliding(space: IBodyR2<ID>, r2: IR2): void { }

    time(lapse: number): boolean {

        const position = this.position;
        this.position = Fisical.getPosition(this.position, this.acceleration, this.velocity, lapse);
        this.velocity = Fisical.getVelocity(this.acceleration, this.velocity, lapse);

        if(this.collisionArea){

            this.collisionArea.position = {

                x: this.collisionArea.position.x + position.x - this.position.x,
                y: this.collisionArea.position.y + position.y - this.position.y

            };

        }
        
        return true;

    }

}