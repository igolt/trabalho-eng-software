export type TickEventListener = (timer: Timer) => void;

export class Timer {
  private interval?: NodeJS.Timer;
  private timeOut: number;
  private _remainingTime: number;
  private tickEventListeners: TickEventListener[];

  constructor(timeOut: number) {
    this.interval = undefined;
    this.timeOut = timeOut;
    this._remainingTime = timeOut;
    this.tickEventListeners = [];
  }

  public isPaused(): boolean {
    return this.interval == undefined;
  }

  public start() {
    if (this.isPaused() && this._remainingTime > 0) {
      this.interval = setInterval(() => {
        this.tickEventListeners.forEach(listener => {
          if (--this._remainingTime == 0) {
            this.pause();
          }
          listener(this);
        });
      }, 1000);
    }
  }

  public pause() {
    if (!this.isPaused()) {
      clearInterval(this.interval);
    }
  }

  public reset() {
    this.pause();
    this._remainingTime = this.timeOut;
  }

  public remainingTime() {
    return this._remainingTime;
  }

  public addTickEventListener(listener: TickEventListener) {
    this.tickEventListeners.push(listener);
  }
}
