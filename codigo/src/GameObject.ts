export abstract class GameObject {
  private _height: number;
  private _width: number;
  private x: number;
  private y: number;

  public constructor(x: number, y: number, width: number, height: number) {
    this._height = height;
    this._width = width;
    this.x = x;
    this.y = y;
  }

  public collideObject(object: GameObject) {
    return !(
      this.positionRight() < object.positionLeft() ||
      this.bottom() < object.top() ||
      this.positionLeft() > object.positionRight() ||
      this.top() > object.bottom()
    );
  }

  /* Now does rectangular collision detection. */

  /* Does rectangular collision detection with the center of the object. */
  public collideObjectCenter(object: GameObject) {
    const centerX = object.centerX();
    const centerY = object.centerY();

    return !(
      centerX < this.positionLeft() ||
      centerX > this.positionRight() ||
      centerY < this.top() ||
      centerY > this.bottom()
    );
  }

  public bottom() {
    return this.y + this._height;
  }

  public centerX() {
    return this.x + this._width * 0.5;
  }

  public centerY() {
    return this.y + this._height * 0.5;
  }

  public positionLeft() {
    return this.x;
  }

  public positionRight() {
    return this.x + this._width;
  }

  public top() {
    return this.y;
  }

  public setBottom(y: number) {
    this.y = y - this._height;
  }

  public setCenterX(x: number) {
    this.x = x - this._width * 0.5;
  }

  public setCenterY(y: number) {
    this.y = y - this._height * 0.5;
  }

  public setPositionLeft(x: number) {
    this.x = x;
  }

  public setPositionRight(x: number) {
    this.x = x - this._width;
  }

  public setTop(y: number) {
    this.y = y;
  }

  public setX(x: number) {
    this.x = x;
  }

  public setY(y: number) {
    this.y = y;
  }

  public height(): number {
    return this._height;
  }

  public width(): number {
    return this._width;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}
