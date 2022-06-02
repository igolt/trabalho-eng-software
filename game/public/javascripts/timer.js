export class Timer {
    constructor(lapse, timed) {
        this.lapse = lapse;
        this.timed = timed;
    }
    run() {
        this._timer = setInterval(() => {
            if (!this.timed.time(this.lapse)) {
                if (this._timer) {
                    clearInterval(this._timer);
                }
            }
        }, this.lapse);
    }
    pause() {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }
}
