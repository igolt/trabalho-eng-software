export class Frame {
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly offsetX: number;
  public readonly offsetY: number;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    offsetX?: number,
    offsetY?: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offsetX = offsetX ?? 0;
    this.offsetY = offsetY ?? 0;
  }
}
