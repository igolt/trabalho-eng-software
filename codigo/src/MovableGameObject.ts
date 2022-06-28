import { GameObject } from "./GameObject";

export abstract class MovableGameObject extends GameObject {
  private _isJumping: boolean;
  private _velocityMax: number;
  private _velocityX: number;
  private _velocityY: number;
  private _xOld: number;
  private _yOld: number;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    velocityMax?: number
  ) {
    super(x, y, width, height);

    this._isJumping = false;
    this._velocityMax = velocityMax ?? 15;
    this._velocityX = 0;
    this._velocityY = 0;
    this._xOld = x;
    this._yOld = y;
  }

  public setXOld(x: number) {
    this._xOld = x;
  }

  public setYOld(y: number) {
    this._yOld = y;
  }

  public isJumping(): boolean {
    return this._isJumping;
  }

  public setJumping(jumping: boolean) {
    this._isJumping = jumping;
  }

  public velocityMax(): number {
    return this._velocityMax;
  }

  public velocityX(): number {
    return this._velocityX;
  }

  public velocityY(): number {
    return this._velocityY;
  }

  public getOldBottom() {
    return this._yOld + this.height();
  }

  public getOldCenterX() {
    return this._xOld + this.width() * 0.5;
  }

  public getOldCenterY() {
    return this._yOld + this.height() * 0.5;
  }

  public getOldLeft() {
    return this._xOld;
  }

  public getOldRight() {
    return this._xOld + this.width();
  }

  public getOldTop() {
    return this._yOld;
  }

  public setOldBottom(y: number) {
    this._yOld = y - this.height();
  }

  public setOldCenterX(x: number) {
    this._xOld = x - this.width() * 0.5;
  }

  public setOldCenterY(y: number) {
    this._yOld = y - this.height() * 0.5;
  }

  public setOldLeft(x: number) {
    this._xOld = x;
  }

  public setOldRight(x: number) {
    this._xOld = x - this.width();
  }

  public setOldTop(y: number) {
    this._yOld = y;
  }

  public setVelocityY(velocityY: number) {
    this._velocityY = velocityY;
  }

  public setVelocityX(velocityX: number) {
    this._velocityX = velocityX;
  }
}
