export class Phase {
    constructor(id, sceneries) {
        this.id = id;
        this.sceneries = sceneries;
        this.index = 0;
    }
    currentSceneryId() {
        if (this.index > -1 && this.index < this.sceneries.length) {
            return this.sceneries[this.index].id;
        }
        return undefined;
    }
    begin() {
        this.index = 0;
        for (const scenery of this.sceneries) {
            scenery.begin();
        }
    }
    end() {
        this.index = this.sceneries.length - 1;
        for (const scenery of this.sceneries) {
            scenery.end();
        }
    }
    previous() {
        if (this.index >= this.sceneries.length)
            this.index = this.sceneries.length - 1;
        for (; this.index > -1; this.index--) {
            let scene = this.sceneries[this.index].previous();
            if (scene !== undefined) {
                return scene;
            }
        }
        return undefined;
    }
    next() {
        if (this.index < 0)
            this.index = 0;
        for (; this.index < this.sceneries.length; this.index++) {
            let scene = this.sceneries[this.index].next();
            if (scene !== undefined) {
                return scene;
            }
        }
        return undefined;
    }
}
