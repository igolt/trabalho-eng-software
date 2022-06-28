import { FrameSet, AnimationMode, IAnimation, Animation } from "./Animation";
import { MovableGameObject } from "./MovableGameObject";

const playerFrameSet = {
  "idle-left": [0],
  "jump-left": [1],
  "move-left": [2, 3, 4, 5],
  "idle-right": [6],
  "jump-right": [7],
  "move-right": [8, 9, 10, 11],
};

const playerDx = 0.55;

const playerMoveAnimationDelay = 5;

enum PlayerDirection {
  Left,
  Right,
}

export class GamePlayer extends MovableGameObject implements IAnimation {
  private animation: Animation;
  private directionX: PlayerDirection;

  public constructor(x: number, y: number) {
    super(x, y, 7, 12);

    this.animation = new Animation(playerFrameSet["idle-left"], 10);

    this.setJumping(true);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.directionX = PlayerDirection.Left;
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

    if (Math.abs(this.velocityX()) > this.velocityMax())
      this.setVelocityX(this.velocityMax() * Math.sign(this.velocityX()));

    if (Math.abs(this.velocityY()) > this.velocityMax())
      this.setVelocityY(this.velocityMax() * Math.sign(this.velocityY()));

    this.setX(this.getX() + this.velocityX());
    this.setY(this.getY() + this.velocityY());
  }
}
