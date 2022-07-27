import { AssetsManager } from "./AssetsManager";
import { Frame } from "./Frame";
import {
  AnimationMode,
  FrameSet,
  GameAnimation,
  IGameAnimation,
} from "./GameAnimation";
import { GameObject } from "./GameObject";
import { Sprite } from "./SpriteSheet";

export abstract class Collectible extends GameObject implements IGameAnimation {
  private animation: GameAnimation;
  private baseX: number;
  private baseY: number;
  private positionX: number;
  private positionY: number;
  private _points: number;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    points: number,
    frames: Frame[],
    frameSet: FrameSet,
    delay: number,
    spriteSheet: Sprite,
    assetsManager: AssetsManager
  ) {
    super(x, y, width, height);

    this.animation = new GameAnimation(
      frames,
      frameSet,
      delay,
      assetsManager,
      spriteSheet
    );

    // baseX e baseY são o ponto no qual o coletável se move. positionX
    // e y são usados para acompanhar o vetor distante do ponto base para dar
    // a cenoura um efeito flutuante
    this.baseX = x;
    this.baseY = y;

    this.positionX = Math.random() * Math.PI * 2;
    this.positionY = this.positionX * 2;

    this._points = points;
  }

  public points(): number {
    return this._points;
  }

  public frame() {
    return this.animation.frame();
  }

  public animate(): void {
    this.animation.animate();
  }

  public frameValue(): number {
    return this.animation.frameValue();
  }

  public changeFrameSet(
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ): void {
    this.animation.changeFrameSet(frameSet, mode, delay, frameIndex);
  }

  public spriteSheet() {
    return this.animation.spriteSheet();
  }

  public loadSprite() {
    return this.animation.loadSprite();
  }

  public updatePosition() {
    this.positionX += 0.1;
    this.positionY += 0.2;

    this.setX(this.baseX + Math.cos(this.positionX) * 2);
    this.setY(this.baseY + Math.cos(this.positionY));
  }
}
