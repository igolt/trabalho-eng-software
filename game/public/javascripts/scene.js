import { ShowableSet } from "./showable.js";
export class Scene {
    constructor(id) {
        this.id = id;
        this._isShowable = true;
        this._background = new ShowableSet();
        this._foreground = new ShowableSet();
        this._bodySet = new Set();
    }
    addBody(body) {
        this._bodySet.add(body);
    }
    deleteBody(body) {
        this._bodySet.delete(body);
    }
    addShowableBackground(showable) {
        this._background.addShowable(showable);
    }
    deleteShowableBackground(showable) {
        this._background.deleteShowable(showable);
    }
    addShowableForeground(showable) {
        this._foreground.addShowable(showable);
    }
    deleteShowableForeground(showable) {
        this._foreground.deleteShowable(showable);
    }
    show() {
        this._background.show();
        this._bodySet.forEach((body) => body.show());
        this._foreground.show();
    }
    isShowable(is) {
        if (is) {
            this._isShowable = is;
        }
        return this._isShowable;
    }
    time(lapse) {
        this.show();
        return true;
    }
    gameStatus(gameStatus) {
        if (gameStatus) {
            this._gameStatus = gameStatus;
        }
        return this._gameStatus;
    }
}
