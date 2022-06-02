export interface IImages {

    load(key: string, url: string, listener:()=>void): void;
    get(key: string): HTMLImageElement;

}

export class Images implements IImages {

    _imagesMap: Map<string, HTMLImageElement> = new Map;

    load(key: string, url: string, listener:()=>void): void {

        var imagem = new Image();
        imagem.src = url;
        this._imagesMap.set(key, imagem);
        imagem.addEventListener("load", listener);

    }

    get(key: string): HTMLImageElement {
        if (this._imagesMap.has(key)) {
            return this._imagesMap.get(key)!;
        }
        throw new Error("image( " + key + " ) not loaded");
    }

}