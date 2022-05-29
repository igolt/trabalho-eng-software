const MAX_CHANNELS = 20;

export class AssetsManager {
  constructor() {
    this.isLoading = 0;
    this.carregadas = 0;
    this.images = {};
    this.audios = {};
    this.channels = [];

    for (let i = 0; i < MAX_CHANNELS; i++) {
      this.channels[i] = {
        audio: new Audio(),
        fim: -1,
      };
    }
  }

  loadImage(key, url) {
    console.log(`Carregando imagem ${url}...`);

    this.isLoading++;
    var image = new Image();
    image.src = url;
    this.images[key] = image;
    var assetsManager = this;
    image.addEventListener("load", () => {
      assetsManager.carregadas++;
      console.log(
        `Imagem ${assetsManager.carregadas}/${assetsManager.isLoading} ${key}: ${url} carregada.`
      );
    });
  }

  image(key) {
    return this.images[key];
  }

  progress() {
    return this.isLoading == 0.0
      ? 0.0
      : (this.carregadas / this.isLoading) * 100;
  }

  loadAudio(key, url) {
    var audio = new Audio(url);
    audio.load();
    this.audios[key] = audio;
  }

  play(key) {
    if (!this.audios[key]) {
      throw new Error(`Chave de audio inválida: ${key}!`);
    }

    for (let i = 0; i < MAX_CHANNELS; i++) {
      const agora = new Date();

      if (this.channels[i].fim < agora.getTime()) {
        this.channels[i].audio.src = this.audios[key].src;
        this.channels[i].fim =
          agora.getTime() + this.audios[key].duration * 1000;
        this.channels[i].audio.play();
        break;
      }
    }
  }
}
