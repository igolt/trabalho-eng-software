import {
  FrameSet,
  AnimationMode,
  IGameAnimation,
  GameAnimation,
} from "./GameAnimation";
import { AssetsManager } from "./AssetsManager";
import { Frame } from "./Frame";
import { MovableGameObject } from "./MovableGameObject";

enum PlayerDirection {
  Left,
  Right,
}

const playerFrameSet = {
  "idle-left": [0],
  "jump-left": [1],
  "move-left": [2, 3, 4, 5],
  "idle-right": [6],
  "jump-right": [7],
  "move-right": [8, 9, 10, 11],
};

const playerFrames = [
  new Frame(115, 96, 13, 16, 0, -4), // idle-left
  new Frame(50, 96, 13, 16, 0, -4), // jump-left
  new Frame(102, 96, 13, 16, 0, -4), // walk-left
  new Frame(89, 96, 13, 16, 0, -4), // walk-left
  new Frame(76, 96, 13, 16, 0, -4), // walk-left
  new Frame(63, 96, 13, 16, 0, -4), // walk-left
  new Frame(0, 112, 13, 16, 0, -4), // idle-right
  new Frame(65, 112, 13, 16, 0, -4), // jump-right
  new Frame(13, 112, 13, 16, 0, -4), // walk-right
  new Frame(26, 112, 13, 16, 0, -4), // walk-right
  new Frame(39, 112, 13, 16, 0, -4), // walk-right
  new Frame(52, 112, 13, 16, 0, -4), // walk-right
];

const playerDx = 0.55;
const playerMoveAnimationDelay = 5;

export class GamePlayer extends MovableGameObject implements IGameAnimation {
  private animation: GameAnimation;
  private directionX: PlayerDirection;
  public static readonly SPRITE_KEY = "game-player";
  public static readonly SPRITE_URL = "sprite_sheets/tileset3.png";

  public constructor(x: number, y: number, assetsManager: AssetsManager) {
    super(x, y, 7, 12);

    this.animation = new GameAnimation(
      playerFrames,
      playerFrameSet["idle-left"],
      10,
      assetsManager,
      {
        key: GamePlayer.SPRITE_KEY,
        url: GamePlayer.SPRITE_URL,
      }
    );

    this.setJumping(true);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.directionX = PlayerDirection.Left;
  }

  public frame() {
    return this.animation.frame();
  }

  public animate(): void {
    this.animation.animate();
  }

  public frameValue(): number {
    return this.animation.frameValue();
  }

  public changeFrameSet(
    frameSet: FrameSet,
    mode?: AnimationMode,
    delay?: number,
    frameIndex?: number
  ): void {
    this.animation.changeFrameSet(frameSet, mode, delay, frameIndex);
  }

  public spriteSheet() {
    return this.animation.spriteSheet();
  }

  public loadSprite() {
    return this.animation.loadSprite();
  }

  public jump() {
    if (!this.isJumping() && this.velocityY() < 10) {
      this.setJumping(true);
      this.setVelocityY(this.velocityY() - 10);
    }
  }

  public moveLeft() {
    this.directionX = PlayerDirection.Left;
    this.setVelocityX(this.velocityX() - playerDx);
  }

  public moveRight() {
    this.directionX = PlayerDirection.Right;
    this.setVelocityX(this.velocityX() + playerDx);
  }

  public updateAnimation() {
    if (this.velocityY() < 0) {
      if (this.directionX == PlayerDirection.Left) {
        this.changeFrameSet(playerFrameSet["jump-left"], "pause");
      } else {
        this.changeFrameSet(playerFrameSet["jump-right"], "pause");
      }
    } else if (this.directionX == PlayerDirection.Left) {
      if (this.velocityX() < -0.1) {
        this.changeFrameSet(
          playerFrameSet["move-left"],
          "loop",
          playerMoveAnimationDelay
        );
      } else {
        this.changeFrameSet(playerFrameSet["idle-left"], "pause");
      }
    } else if (this.directionX == PlayerDirection.Right) {
      if (this.velocityX() > 0.1) {
        this.changeFrameSet(
          playerFrameSet["move-right"],
          "loop",
          playerMoveAnimationDelay
        );
      } else {
        this.changeFrameSet(playerFrameSet["idle-right"], "pause");
      }
    }
    this.animate();
  }

  public updatePosition(gravity: number, friction: number) {
    this.setXOld(this.getX());
    this.setYOld(this.getY());

    this.setVelocityY(this.velocityY() + gravity);
    this.setVelocityX(this.velocityX() * friction);

    if (Math.abs(this.velocityX()) > this.velocityMax()) {
      this.setVelocityX(this.velocityMax() * Math.sign(this.velocityX()));
    }

    if (Math.abs(this.velocityY()) > this.velocityMax()) {
      this.setVelocityY(this.velocityMax() * Math.sign(this.velocityY()));
    }

    this.setX(this.getX() + this.velocityX());
    this.setY(this.getY() + this.velocityY());
  }
}
