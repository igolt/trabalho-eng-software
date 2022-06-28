import { Animation } from "./Animation";

export class Grass extends Animation {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    super([14, 15, 16, 15], 25);
    this.x = x;
    this.y = y;
  }
}
