import { GameObject } from "./GameObject";

export class Door extends GameObject {
  public readonly destinationX: number;
  public readonly destinationY: number;
  public readonly destinationZone: string;
  public readonly _requiredKey: string;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    destinationX: number,
    destinationY: number,
    destinationZone: string,
    requiredKey?: string
  ) {
    super(x, y, width, height);
    this.destinationX = destinationX;
    this.destinationY = destinationY;
    this.destinationZone = destinationZone;
    this._requiredKey = requiredKey ?? "";
  }

  public hasLock() {
    return this._requiredKey != "";
  }

  public requiredKey() {
    return this._requiredKey;
  }
}
