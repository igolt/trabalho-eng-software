// export type TickEventListener = (timer: Timer) => void;

// export class Timer {
//   private interval?: NodeJS.Timer;
//   private timeOut: number;
//   private remainingTime: number;
//   private tickEventListeners: TickEventListener[];

//   constructor(timeOut: number) {
//     this.interval = undefined;
//     this.timeOut = timeOut;
//     this.remainingTime = timeOut;
//     this.tickEventListeners = [];
//   }

//   public isPaused(): boolean {
//     return this.interval == undefined;
//   }

//   public start() {
//     if (this.isPaused()) {
//       this.interval = setInterval(() => {
//         this.tickEventListeners.forEach(listener => listener(this));
//       }, 1000);
//     }
//   }

//   public pause() {}

//   public reset() {}

//   public time() {}

//   public addTickEventListener() {}
// }
