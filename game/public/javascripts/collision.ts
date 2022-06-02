import { IBodyR2 } from "./body.js";
import { IR2 } from "./ir2.js";

export interface ICollisionR2 {
    check(): void;
}

export class CollisionR2<ID> implements ICollisionR2 {

    _set: Set<IBodyR2<ID>> = new Set();

    add(space: IBodyR2<ID>) {
        this._set.add(space);
    }

    delete(space: IBodyR2<ID>) {
        this._set.delete(space);
    }

    check() {
        this._set.forEach(element1 => {

            if (element1.isColliding()) {

                this._set.forEach(element2 => {

                    if (element2.isColliding()) {

                        if (element1 != element2) {

                            const isColliding = CollisionR2.isColliding(element1, element2);

                            if (isColliding) {

                                return {
                                    x: element1.collisionArea!.position.x + element1.collisionArea!.dimension.x - element2.collisionArea!.position.x,
                                    y: element1.collisionArea!.position.y + element1.collisionArea!.dimension.y - element2.collisionArea!.position.y
                                };

                            }

                        }
                    }

                });

            }
        });
    }



    public static isColliding<ID>(b1: IBodyR2<ID>, b2: IBodyR2<ID>): boolean {

        if (b1.collisionArea && b2.collisionArea) {

            if (b1.collisionArea.position.x < b2.collisionArea.position.x + b2.collisionArea.dimension.x &&
                b1.collisionArea.position.x + b1.collisionArea.dimension.x > b2.collisionArea.position.x &&
                b1.collisionArea.position.y < b2.collisionArea.position.y + b2.collisionArea.dimension.y &&
                b1.collisionArea.position.y + b1.collisionArea.dimension.y > b2.collisionArea.position.y) {
                return true;
            }

        }

        return false;

    }

    public static collision<ID>(b1: IBodyR2<ID>, b2: IBodyR2<ID>): IR2 {

        const isColliding = CollisionR2.isColliding(b1, b2);

        if (isColliding) {

            return {
                x: b1.collisionArea!.position.x + b1.collisionArea!.dimension.x - b2.collisionArea!.position.x,
                y: b1.collisionArea!.position.y + b1.collisionArea!.dimension.y - b2.collisionArea!.position.y
            };

        }

        return {
            x: 0,
            y: 0
        };

    }

}