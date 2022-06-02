import { IR2 } from "./ir2.js";

export class Fisical {

    public static getVelocity(aceleration: IR2, initialVelocity: IR2, deltaTime: number): IR2 {
        return {
            x: initialVelocity.x + aceleration.x * deltaTime,
            y: initialVelocity.y + aceleration.y * deltaTime
        };
    }

    public static getPosition(initialPosition: IR2, aceleration: IR2, initialVelocity: IR2, deltaTime: number): IR2 {
        return {
            x: initialPosition.x + initialVelocity.x * deltaTime + aceleration.x * deltaTime * deltaTime / 2,
            y: initialPosition.y + initialVelocity.y * deltaTime + aceleration.y * deltaTime * deltaTime / 2
        };
    }
    
}