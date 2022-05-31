export interface IAssetsManager {
    // loadImage(key:string, uri:string):void;
    // loadAudio(key:string, uri:string):void;
    img(key: string): HTMLImageElement;
    // progress():number;
    play(key: string): void;
}

export class AssetsManagar implements IAssetsManager {

    aCarregar: number = 0;
    carregadas: number = 0;

    imagesMap: Map<string, HTMLImageElement> = new Map();
    audioMap: Map<string, HTMLMediaElement> = new Map();
    channels: { audio: HTMLMediaElement, fim: number }[] = [];

    constructor(private MAX_CHANNELS: number = 20) {

        for (var i = 0; i < this.MAX_CHANNELS; i++) {
            this.channels[i] = {
                audio: new Audio(),
                fim: -1
            };
        }

    }


    loadImage(key: string, uri: string): void {
        console.log(`Carregando imagem ${uri}...`);
        this.aCarregar++;
        var imagem = new Image();
        imagem.src = uri;
        this.imagesMap.set(key, imagem);
        var that = this;
        imagem.addEventListener("load", function () {
            that.carregadas++;
            console.log(`Imagem ${that.carregadas}/${that.aCarregar} ${key}: ${uri} carregada.`);
        });
    }

    loadAudio(key: string, uri: string): void {
        console.log(`Carregando audio ${key}: ${uri}...`);
        //this.aCarregar++;
        var audio = new Audio();
        audio.src = uri;
        audio.load();
        this.audioMap.set(key, audio);
        var that = this;
        /*audio.addEventListener("canplay", function () {
            //that.carregadas++;
            console.log(`Audio ${that.carregadas}/${that.aCarregar} ${key}: ${url} carregado.`);
        });
        */
    }

    img(key: string): HTMLImageElement {

        const ret = this.imagesMap.get(key);

        if(ret !== undefined){
            return ret;
        }

        throw new Error(`Chave de imagem inválida: ${key}!`);
    }

    progress(): number {
        if (this.aCarregar != 0) {
            return this.carregadas / this.aCarregar * 100.0;
        } else return 0.0;
    }

    play(key: string): void {

        const audio = this.audioMap.get(key);

        if (audio !== undefined) {

            for (var i = 0; i < this.MAX_CHANNELS; i++) {
                var agora = new Date();
                if (this.channels[i].fim < agora.getTime()) {
                    this.channels[i].audio.src = audio.src;
                    this.channels[i].fim = agora.getTime() + audio.duration * 1000;
                    this.channels[i].audio.play();
                    break;
                }

            }

        } else {

            throw new Error(`Chave de audio inválida: ${key}!`);

        }


    }


}
    
