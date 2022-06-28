export type AnimationMode = "loop" | "pause";
export type FrameSet = Array<number>;

export interface IAnimation {
  frameValue: () => number;
  animate: () => void;
  changeFrameSet: (
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ) => void;
}

export class Animation implements IAnimation {
  private count: number;
  private delay: number;
  private frameSet: FrameSet;
  private frameIndex: number;
  private _frameValue: number;
  private mode: AnimationMode;

  public constructor(
    frameSet: FrameSet,
    delay: number,
    mode?: AnimationMode,
    frameIndex?: number
  ) {
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
