import { AssetsManager } from "./AssetsManager";
import { SpriteSheet, Sprite } from "./SpriteSheet";
import { Frame } from "./Frame";

export type AnimationMode = "loop" | "pause";
export type FrameSet = number[];

export interface IGameAnimation {
  frame: () => Frame;
  frameValue: () => number;
  animate: () => void;
  spriteSheet: () => HTMLImageElement;
  changeFrameSet: (
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ) => void;
  loadSprite: () => Promise<void>;
}

export class GameAnimation implements IGameAnimation {
  private _frames: Frame[];
  private count: number;
  private delay: number;
  private _spriteSheet: SpriteSheet;
  private frameSet: FrameSet;
  private frameIndex: number;
  private _frameValue: number;
  private mode: AnimationMode;

  public constructor(
    frames: Frame[],
    frameSet: FrameSet,
    delay: number,
    assetsManager: AssetsManager,
    sprite: Sprite,
    mode?: AnimationMode,
    frameIndex?: number
  ) {
    this._spriteSheet = new SpriteSheet(assetsManager, sprite);

    this._frames = frames;
    this.count = 0;
    this.delay = delay >= 1 ? delay : 1;
    this.frameSet = frameSet;
    this.frameIndex = frameIndex ?? 0;
    this._frameValue = this.frameSet[0];
    this.mode = mode ?? "loop";
  }

  public frame() {
    return this._frames[this.frameValue()];
  }

  public frameValue(): number {
    return this._frameValue;
  }

  public animate(): void {
    if (this.mode == "loop") {
      this.count++;

      while (this.count > this.delay) {
        this.count -= this.delay;

        this.frameIndex = (this.frameIndex + 1) % this.frameSet.length;
        this._frameValue = this.frameSet[this.frameIndex];
      }
    }
  }

  public async loadSprite() {
    await this._spriteSheet.load();
  }

  public spriteSheet() {
    return this._spriteSheet.image();
  }

  public changeFrameSet(
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ) {
    if (this.frameSet === frameSet) {
      return;
    }

    this.count = 0;
    if (delay) {
      this.delay = delay >= 1 ? delay : 1;
    } else {
      this.delay = 10;
    }
    this.frameSet = frameSet;
    this.frameIndex = frameIndex ?? 0;
    this._frameValue = this.frameSet[0];
    this.mode = mode ?? "loop";
  }
}
