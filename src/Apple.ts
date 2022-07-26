import { AssetsManager } from "./AssetsManager";
import { Collectible } from "./Collectible";
import { Frame } from "./Frame";

const appleFrames = [new Frame(81, 112, 14, 16), new Frame(96, 112, 16, 16)];

const appleFrameSet = [0, 1];

export class Apple extends Collectible {
  public static readonly SPRITE_KEY = "game-apple";
  public static readonly SPRITE_URL = "sprite_sheets/tileset2.png";
  public static readonly POINTS = 10;

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super(
      x,
      y,
      7,
      14,
      Apple.POINTS,
      appleFrames,
      appleFrameSet,
      15,
      {
        key: Apple.SPRITE_KEY,
        url: Apple.SPRITE_URL,
      },
      assetsManager
    );
  }
}
