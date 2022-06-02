export class Scenery {
    constructor(id, scenes) {
        this.id = id;
        this.scenes = scenes;
        this.index = -1;
    }
    begin() {
        this.index = -1;
    }
    end() {
        this.index = this.scenes.length;
    }
    next() {
        this.index++;
        if (this.index < this.scenes.length) {
            return this.scenes[this.index];
        }
        return undefined;
    }
    previous() {
        this.index--;
        if (this.index > -1) {
            return this.scenes[this.index];
        }
        return undefined;
    }
}
