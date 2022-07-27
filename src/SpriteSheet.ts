import { AssetsManager } from "./AssetsManager";

export type Sprite = HTMLImageElement | { key: string; url: string };

const isImage = (obj: unknown): obj is HTMLImageElement =>
  obj instanceof HTMLImageElement;

export class SpriteSheet {
  private assetsManager: AssetsManager;
  private sprite: Sprite;

  constructor(assetsManager: AssetsManager, sprite: Sprite) {
    this.sprite = sprite;
    this.assetsManager = assetsManager;
  }

  async load(): Promise<void> {
    if (!isImage(this.sprite)) {
      this.sprite = await this.assetsManager.loadImage(
        this.sprite.key,
        this.sprite.url
      );
    }
  }

  image(): HTMLImageElement {
    if (isImage(this.sprite)) {
      return this.sprite;
    }
    throw new Error("SpriteSheet::image: sprite image not loaded");
  }
}
