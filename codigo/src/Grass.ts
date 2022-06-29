import { Animation } from "./Animation";
import { AssetsManager } from "./AssetsManager";

export class Grass extends Animation {
  public readonly x: number;
  public readonly y: number;
  public static readonly SPRITE_KEY = "game-grass";
  public static readonly SPRITE_URL = "sprite_sheets/rabbit-trap3.png";

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super([14, 15, 16, 15], 25, assetsManager, {
      key: Grass.SPRITE_KEY,
      url: Grass.SPRITE_URL,
    });
    this.x = x;
    this.y = y;
  }
}
