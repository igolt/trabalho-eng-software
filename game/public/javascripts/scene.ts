import { IShowable, ShowableSet } from "./showable.js";
import { IGameStatus } from "./gamestatus.js";
import { ITimed } from "./timed.js";
import { IBodyR2 } from "./body.js";

export interface IScene<ID> extends IShowable, ITimed{
    id:ID;
    gameStatus(gameStatus?:IGameStatus<ID>):IGameStatus<ID> | undefined;
}

export class Scene<ID> implements IScene<ID>{

    _gameStatus:IGameStatus<ID>  | undefined;
    _isShowable:boolean = true;
    _background:ShowableSet = new ShowableSet();
    _foreground:ShowableSet = new ShowableSet();
    _bodySet: Set<IBodyR2<ID>> = new Set();

    constructor(public id:ID){ }

    addBody(body:IBodyR2<ID>){
        this._bodySet.add(body);
    }

    deleteBody(body:IBodyR2<ID>){
        this._bodySet.delete(body);
    }

    addShowableBackground(showable: IShowable) {
        this._background.addShowable(showable);
    }

    deleteShowableBackground(showable: IShowable) {
        this._background.deleteShowable(showable);
    }

    addShowableForeground(showable: IShowable) {
        this._foreground.addShowable(showable);
    }

    deleteShowableForeground(showable: IShowable) {
        this._foreground.deleteShowable(showable);
    }

    show(): void {
        this._background.show();
        this._bodySet.forEach((body)=>body.show());
        this._foreground.show();
    }

    isShowable(is?: boolean | undefined): boolean {
        if(is){
            this._isShowable = is;
        }
        return this._isShowable;
    }

    time(lapse: number): boolean {
        this.show();
        return true;
    }

    gameStatus(gameStatus?: IGameStatus<ID>): IGameStatus<ID> | undefined {
        if(gameStatus){
            this._gameStatus = gameStatus;
        }
        return this._gameStatus;
    }
    
}

