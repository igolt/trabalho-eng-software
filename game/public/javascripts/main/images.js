export class Images {
    constructor() {
        this._imagesMap = new Map;
    }
    load(key, url, listener) {
        var imagem = new Image();
        imagem.src = url;
        this._imagesMap.set(key, imagem);
        imagem.addEventListener("load", listener);
    }
    get(key) {
        if (this._imagesMap.has(key)) {
            return this._imagesMap.get(key);
        }
        throw new Error("image( " + key + " ) not loaded");
    }
}
