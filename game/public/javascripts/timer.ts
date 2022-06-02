import { ITimed } from "./timed.js";

export interface ITimer {

    run(): void;
    pause(): void;

}

export class Timer implements ITimer {

    _timer: NodeJS.Timeout | undefined;

    constructor(private lapse: number, private timed: ITimed) { }

    run(): void {

        this._timer = setInterval(() => {

            if (!this.timed.time(this.lapse)){
                
                if (this._timer) {

                    clearInterval(this._timer);
        
                }
            
            }

        }, this.lapse);

    }


    pause(): void {

        if (this._timer) {

            clearInterval(this._timer);

        }

    }

}
