export class CollisionR2 {
    constructor() {
        this._set = new Set();
    }
    add(space) {
        this._set.add(space);
    }
    delete(space) {
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
                                    x: element1.collisionArea.position.x + element1.collisionArea.dimension.x - element2.collisionArea.position.x,
                                    y: element1.collisionArea.position.y + element1.collisionArea.dimension.y - element2.collisionArea.position.y
                                };
                            }
                        }
                    }
                });
            }
        });
    }
    static isColliding(b1, b2) {
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
    static collision(b1, b2) {
        const isColliding = CollisionR2.isColliding(b1, b2);
        if (isColliding) {
            return {
                x: b1.collisionArea.position.x + b1.collisionArea.dimension.x - b2.collisionArea.position.x,
                y: b1.collisionArea.position.y + b1.collisionArea.dimension.y - b2.collisionArea.position.y
            };
        }
        return {
            x: 0,
            y: 0
        };
    }
}
