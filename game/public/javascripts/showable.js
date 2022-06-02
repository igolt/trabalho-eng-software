export class ShowableSet {
    constructor() {
        this._set = new Set();
        this._isShowable = true;
    }
    isShowable(is) {
        if (is) {
            this._isShowable = is;
        }
        return this._isShowable;
    }
    addShowable(showable) {
        this._set.add(showable);
    }
    deleteShowable(showable) {
        this._set.delete(showable);
    }
    show() {
        this._set.forEach(element => {
            if (element.isShowable()) {
                element.show();
            }
        });
    }
}
