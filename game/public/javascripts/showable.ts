export interface IShowable {
    show(): void;
    isShowable(is?: boolean): boolean;
}

export class ShowableSet implements IShowable {

    _set: Set<IShowable> = new Set();
    _isShowable: boolean = true;

    isShowable(is?: boolean): boolean {
        if (is) {
            this._isShowable = is;
        }
        return this._isShowable;
    }

    addShowable(showable: IShowable) {
        this._set.add(showable);
    }

    deleteShowable(showable: IShowable) {
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