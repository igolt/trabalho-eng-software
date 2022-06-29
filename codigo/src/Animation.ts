import { AssetsManager } from "./AssetsManager";

export type AnimationMode = "loop" | "pause";
export type FrameSet = Array<number>;

export interface IAnimation {
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

const isImage = (obj: any): obj is HTMLImageElement =>
  obj instanceof HTMLImageElement;

export class Animation implements IAnimation {
  private count: number;
  private delay: number;
  private _spriteSheet: HTMLImageElement | { key: string; url: string };
  private frameSet: FrameSet;
  private frameIndex: number;
  private _frameValue: number;
  private mode: AnimationMode;
  private assetsManager: AssetsManager;

  public constructor(
    frameSet: FrameSet,
    delay: number,
    assetsManager: AssetsManager,
    spriteSheet: HTMLImageElement | { key: string; url: string },
    mode?: AnimationMode,
    frameIndex?: number
  ) {
    if (!isImage(spriteSheet)) {
      if (assetsManager.imageIsLoaded(spriteSheet.key)) {
        this._spriteSheet = assetsManager.getImage(spriteSheet.key);
      } else {
        this._spriteSheet = spriteSheet;
      }
    } else {
      this._spriteSheet = spriteSheet;
    }

    this.assetsManager = assetsManager;
    this.count = 0;
    this.delay = delay >= 1 ? delay : 1;
    this.frameSet = frameSet;
    this.frameIndex = frameIndex ?? 0;
    this._frameValue = this.frameSet[0];
    this.mode = mode ?? "loop";
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
    if (!isImage(this._spriteSheet)) {
      this._spriteSheet = await this.assetsManager.getOrLoadImage(
        this._spriteSheet.key,
        this._spriteSheet.url
      );
    }
  }

  public spriteSheet() {
    if (isImage(this._spriteSheet)) {
      return this._spriteSheet;
    }
    throw new Error("Animation::spriteSheet: spritesheet not loaded");
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
