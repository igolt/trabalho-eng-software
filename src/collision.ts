import { MovableGameObject } from "./MovableGameObject";

export const collidePlatformBottom = (
  object: MovableGameObject,
  tileBottom: number
): boolean => {
  if (object.top() < tileBottom && object.getOldTop() >= tileBottom) {
    object.setTop(tileBottom);
    object.setVelocityY(0);
    return true;
  }
  return false;
};

export const collidePlatformLeft = (
  object: MovableGameObject,
  tileLeft: number
): boolean => {
  if (object.positionRight() > tileLeft && object.getOldRight() <= tileLeft) {
    object.setPositionRight(tileLeft - 0.01);
    object.setVelocityX(0);
    return true;
  }
  return false;
};

export const collidePlatformRight = (
  object: MovableGameObject,
  tileRight: number
): boolean => {
  if (object.positionLeft() < tileRight && object.getOldLeft() >= tileRight) {
    object.setPositionLeft(tileRight);
    object.setVelocityX(0);
    return true;
  }
  return false;
};

export const collidePlatformTop = (
  object: MovableGameObject,
  tileTop: number
): boolean => {
  if (object.bottom() > tileTop && object.getOldBottom() <= tileTop) {
    object.setBottom(tileTop - 0.01);
    object.setVelocityY(0);
    object.setJumping(false);
    return true;
  }
  return false;
};

export const collide = (
  value: number,
  object: MovableGameObject,
  tileX: number,
  tileY: number,
  tileSize: number
) => {
  switch (value) {
    case 1:
      collidePlatformTop(object, tileY);
      break;
    case 2:
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 3:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 4:
      collidePlatformBottom(object, tileY + tileSize);
      break;
    case 5:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      collidePlatformBottom(object, tileY + tileSize);
      break;
    case 6:
      if (collidePlatformRight(object, tileX + tileSize)) {
        return;
      }
      collidePlatformBottom(object, tileY + tileSize);
      break;
    case 7:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      if (collidePlatformBottom(object, tileY + tileSize)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 8:
      collidePlatformLeft(object, tileX);
      break;
    case 9:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      collidePlatformLeft(object, tileX);
      break;
    case 10:
      if (collidePlatformLeft(object, tileX)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 11:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      if (collidePlatformLeft(object, tileX)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 12:
      if (collidePlatformBottom(object, tileY + tileSize)) {
        return;
      }
      collidePlatformLeft(object, tileX);
      break;
    case 13:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      if (collidePlatformBottom(object, tileY + tileSize)) {
        return;
      }
      collidePlatformLeft(object, tileX);
      break;
    case 14:
      if (collidePlatformBottom(object, tileY + tileSize)) {
        return;
      }
      if (collidePlatformLeft(object, tileX)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
    case 15:
      if (collidePlatformTop(object, tileY)) {
        return;
      }
      if (collidePlatformBottom(object, tileY + tileSize)) {
        return;
      }
      if (collidePlatformLeft(object, tileX)) {
        return;
      }
      collidePlatformRight(object, tileX + tileSize);
      break;
  }
};
