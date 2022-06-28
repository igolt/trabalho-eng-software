import { loadAudio, requestImage, requestJSON } from "./assets-utils";

interface Channel {
  audio: HTMLAudioElement;
  end: number;
}

async function _loadTemplate<T>(
  assetsMap: Map<string, T>,
  key: string,
  url: string | URL,
  loadFn: (url: string | URL) => Promise<T>
) {
  const asset = await loadFn(url);

  assetsMap.set(key, asset);

  return asset;
}

// NOTE(igolt): lógica de channels/play de áudio deve ser algo separado do AssetsManager
export class AssetsManager {
  private _loadedImages: Map<string, HTMLImageElement>;
  private _loadedAudios: Map<string, HTMLAudioElement>;
  private _loadedJsons: Map<string, any>;
  private _channels: Array<Channel>;
  public static MAX_CHANNELS = 20;

  constructor() {
    this._channels = [];
    this._loadedImages = new Map<string, HTMLImageElement>();
    this._loadedAudios = new Map<string, HTMLAudioElement>();
    this._loadedJsons = new Map<string, any>();

    for (let i = 0; i < AssetsManager.MAX_CHANNELS; i++) {
      this._channels[i] = {
        audio: new Audio(),
        end: -1,
      };
    }
  }

  public async loadImage(key: string, url: string | URL) {
    return _loadTemplate(this._loadedImages, key, url, requestImage);
  }

  private _getImage(key: string) {
    return this._loadedImages.get(key);
  }

  public getImage(key: string) {
    const image = this._getImage(key);

    if (image) {
      return image;
    }
    throw new Error(
      `AssetsManager::getImage: could not found image with key: "${key}"`
    );
  }

  public loadAudio(key: string, url: string | URL) {
    const audio = loadAudio(url);

    this._loadedAudios.set(key, audio);
    return audio;
  }

  private _getAudio(key: string) {
    return this._loadedAudios.get(key);
  }

  public getAudio(key: string) {
    const audio = this._getAudio(key);

    if (audio) {
      return audio;
    }
    throw new Error(
      `AssetsManager::getAudio: could not found audio with key: "${key}"`
    );
  }

  private _play(audio: HTMLAudioElement) {
    for (let i = 0; i < AssetsManager.MAX_CHANNELS; i++) {
      const now = new Date();

      if (this._channels[i].end < now.getTime()) {
        this._channels[i].audio.src = audio.src;
        this._channels[i].end = now.getTime() + audio.duration * 1000;
        this._channels[i].audio.play();
        break;
      }
    }
  }

  public play(key: string) {
    this._play(this.getAudio(key));
  }

  public async loadJSON(key: string, url: string | URL) {
    return await _loadTemplate(this._loadedJsons, key, url, requestJSON);
  }

  private _getJSON(key: string) {
    return this._loadedJsons.get(key);
  }

  public getJSON(key: string) {
    const json = this._getJSON(key);

    if (json !== null && json !== undefined) {
      return json;
    }
    throw new Error(
      `AssetsManager::getJSON could not found JSON with key: "${key}"`
    );
  }

  public async getOrLoadJSON(key: string, url: string | URL) {
    const json = this._getJSON(key);

    return json ?? (await this.loadJSON(key, url));
  }
}
