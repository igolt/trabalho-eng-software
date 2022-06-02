export class Fisical {
    static getVelocity(aceleration, initialVelocity, deltaTime) {
        return {
            x: initialVelocity.x + aceleration.x * deltaTime,
            y: initialVelocity.y + aceleration.y * deltaTime
        };
    }
    static getPosition(initialPosition, aceleration, initialVelocity, deltaTime) {
        return {
            x: initialPosition.x + initialVelocity.x * deltaTime + aceleration.x * deltaTime * deltaTime / 2,
            y: initialPosition.y + initialVelocity.y * deltaTime + aceleration.y * deltaTime * deltaTime / 2
        };
    }
}
