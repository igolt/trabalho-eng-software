import { Fisical } from "../javascripts/fisical.js";
import { SpaceR2 } from "../javascripts/space.js";
export class BodyR2 extends SpaceR2 {
    constructor(id, position, dimension, collisionArea, acceleration = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }) {
        super(id, position, dimension);
        this.position = position;
        this.dimension = dimension;
        this.collisionArea = collisionArea;
        this.acceleration = acceleration;
        this.velocity = velocity;
        this._isColliding = true;
        this._isShowable = true;
    }
    isShowable(is) {
        if (is) {
            this._isShowable = is;
        }
        return this._isShowable;
    }
    isColliding(is) {
        if (is) {
            this._isColliding = is;
        }
        return this._isColliding;
    }
    ifColliding(space, r2) { }
    time(lapse) {
        const position = this.position;
        this.position = Fisical.getPosition(this.position, this.acceleration, this.velocity, lapse);
        this.velocity = Fisical.getVelocity(this.acceleration, this.velocity, lapse);
        if (this.collisionArea) {
            this.collisionArea.position = {
                x: this.collisionArea.position.x + position.x - this.position.x,
                y: this.collisionArea.position.y + position.y - this.position.y
            };
        }
        return true;
    }
}
