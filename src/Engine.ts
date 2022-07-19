export type UpdateCallback = FrameRequestCallback;
export type RenderCallback = FrameRequestCallback;

export class Engine {
  private accumulatedTime: number;
  private animationFrameRequest?: number;
  private time: number;
  private timeStep: number;
  private didUpdate: boolean;
  private update: UpdateCallback;
  private render: RenderCallback;

  public constructor(
    timeStep: number,
    update: UpdateCallback,
    render: RenderCallback
  ) {
    this.accumulatedTime = 0;
    this.animationFrameRequest = undefined;
    this.time = 0;
    this.timeStep = timeStep;
    this.didUpdate = false;

    this.update = update;
    this.render = render;
  }

  private run(timeStep: number) {
    this.requestAnimationFrame();

    this.accumulatedTime += timeStep - this.time;
    this.time = timeStep;

    if (this.accumulatedTime >= this.timeStep * 3) {
      this.accumulatedTime = this.timeStep;
    }

    while (this.accumulatedTime >= this.timeStep) {
      this.accumulatedTime -= this.timeStep;

      this.update(timeStep);

      this.didUpdate = true;
    }

    if (this.didUpdate) {
      this.didUpdate = false;
      this.render(timeStep);
    }
  }

  private requestAnimationFrame() {
    this.animationFrameRequest = window.requestAnimationFrame(timeStep =>
      this.run(timeStep)
    );
  }

  public start() {
    this.accumulatedTime = this.timeStep;
    this.time = window.performance.now();
    this.requestAnimationFrame();
  }

  public isRunning(): boolean {
    return this.animationFrameRequest !== undefined;
  }

  public stop() {
    if (this.isRunning()) {
      window.cancelAnimationFrame(this.animationFrameRequest as number);
      this.animationFrameRequest = undefined;
    }
  }
}
