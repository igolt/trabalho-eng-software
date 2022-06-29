import { GameObject } from "./GameObject";

export class Door extends GameObject {
  public readonly destinationX: number;
  public readonly destinationY: number;
  public readonly destinationZone: string;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    destinationX: number,
    destinationY: number,
    destinationZone: string
  ) {
    super(x, y, width, height);
    this.destinationX = destinationX;
    this.destinationY = destinationY;
    this.destinationZone = destinationZone;
  }
}
