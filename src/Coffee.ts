import { AssetsManager } from "./AssetsManager";
import { Collectible } from "./Collectible";
import { Frame } from "./Frame";

const coffeeFrames = [new Frame(81, 112, 14, 16), new Frame(96, 112, 16, 16)];

const coffeeFrameSet = [0, 1];

export class Coffee extends Collectible {
  public static readonly SPRITE_KEY = "game-coffee";
  public static readonly SPRITE_URL = "sprite_sheets/tileset3.png";
  public static readonly POINTS = 1;

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super(
      x,
      y,
      7,
      14,
      Coffee.POINTS,
      coffeeFrames,
      coffeeFrameSet,
      15,
      {
        key: Coffee.SPRITE_KEY,
        url: Coffee.SPRITE_URL,
      },
      assetsManager
    );
  }
}
