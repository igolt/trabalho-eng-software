export class Game {
    constructor(id, phases) {
        this.id = id;
        this.phases = phases;
        this.index = 0;
    }
    currentSceneryId() {
        if (this.index > -1 && this.index < this.phases.length) {
            return this.phases[this.index].currentSceneryId();
        }
        return undefined;
    }
    currentPhaseId() {
        if (this.index > -1 && this.index < this.phases.length) {
            return this.phases[this.index].id;
        }
        return undefined;
    }
    next() {
        if (this.index < 0)
            this.index = 0;
        for (; this.index < this.phases.length; this.index++) {
            let scene = this.phases[this.index].next();
            if (scene !== undefined) {
                return scene;
            }
        }
        return undefined;
    }
    previous() {
        if (this.index >= this.phases.length)
            this.index = this.phases.length - 1;
        for (; this.index > -1; this.index--) {
            let scene = this.phases[this.index].previous();
            if (scene !== undefined) {
                return scene;
            }
        }
        return undefined;
    }
    begin() {
        this.index = 0;
        for (const phase of this.phases) {
            phase.begin();
        }
    }
    end() {
        this.index = this.phases.length - 1;
        for (const phase of this.phases) {
            phase.end();
        }
    }
}
