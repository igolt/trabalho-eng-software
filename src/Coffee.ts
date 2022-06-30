import { FrameSet, AnimationMode, IAnimation, Animation } from "./Animation";
import { AssetsManager } from "./AssetsManager";
import { GameObject } from "./GameObject";
import { Frame } from "./Frame";

const coffeeFrames = [new Frame(81, 112, 14, 16), new Frame(96, 112, 16, 16)];

const coffeeFrameSet = [0, 1];

export class Coffee extends GameObject implements IAnimation {
  private animation: Animation;
  private baseX: number;
  private baseY: number;
  private positionX: number;
  private positionY: number;
  public static readonly SPRITE_KEY = "game-coffee";
  public static readonly SPRITE_URL = "sprite_sheets/rabbit-trap3.png";

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super(x, y, 7, 14);

    this.animation = new Animation(
      coffeeFrames,
      coffeeFrameSet,
      15,
      assetsManager,
      {
        key: Coffee.SPRITE_KEY,
        url: Coffee.SPRITE_URL,
      }
    );
    // baseX e baseY são o ponto no qual o café se move. positionX
    // e y são usados para acompanhar o vetor distante do ponto base para dar
    // a cenoura um efeito flutuante
    this.baseX = x;
    this.baseY = y;

    this.positionX = Math.random() * Math.PI * 2;
    this.positionY = this.positionX * 2;
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
