import { GameAnimation } from "./GameAnimation";
import { AssetsManager } from "./AssetsManager";
import { Frame } from "./Frame";

const grassFrames = [
  new Frame(112, 115, 16, 4),
  new Frame(112, 124, 16, 4),
  new Frame(112, 119, 16, 4), // grass
];

const grassFrameSet = [0, 1, 2, 1];

export class Grass extends GameAnimation {
  public readonly x: number;
  public readonly y: number;
  public static readonly SPRITE_KEY = "game-grass";
  public static readonly SPRITE_URL = "sprite_sheets/tileset3.png";

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super(grassFrames, grassFrameSet, 25, assetsManager, {
      key: Grass.SPRITE_KEY,
      url: Grass.SPRITE_URL,
    });
    this.x = x;
    this.y = y;
  }
}
