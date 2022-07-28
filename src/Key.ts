import { AssetsManager } from "./AssetsManager";
import { Collectible } from "./Collectible";
import { Frame } from "./Frame";

const keyFrames = [new Frame(81, 112, 14, 16), new Frame(96, 112, 16, 16)];

const keyFrameSet = [0, 1];

export class Key extends Collectible {
  private _keyName: string;
  public static readonly SPRITE_KEY = "game-key";
  public static readonly SPRITE_URL = "sprite_sheets/tileset2.png";
  public static readonly POINTS = 10;

  public constructor(
    x: number,
    y: number,
    keyName: string,
    assetsManager: AssetsManager
  ) {
    super(
      x,
      y,
      7,
      14,
      Key.POINTS,
      keyFrames,
      keyFrameSet,
      15,
      {
        key: Key.SPRITE_KEY,
        url: Key.SPRITE_URL,
      },
      assetsManager
    );
    this._keyName = keyName;
  }

  public keyName(): string {
    return this._keyName;
  }
}
