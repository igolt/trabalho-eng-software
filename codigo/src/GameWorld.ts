import { Carrot } from "./Carrot";
import { Door } from "./Door";
import { GamePlayer } from "./GamePlayer";
import { IZone } from "./GameZone";
import { Grass } from "./Grass";
import { collide } from "./collision";
import { MovableGameObject } from "./MovableGameObject";
import { Frame } from "./Frame";
import { AssetsManager } from "./AssetsManager";

type DoorCollisionListener = (door: Door) => void;
type CarrotCollisionListener = (carrot: Carrot) => void;

// WARN(igolt): remover isso depois
const testTileSet = {
  columns: 8,
  rows: 8,
  tileSize: 16,
  frames: [
    new Frame(115, 96, 13, 16, 0, -4), // idle-left
    new Frame(50, 96, 13, 16, 0, -4), // jump-left
    new Frame(102, 96, 13, 16, 0, -4),
    new Frame(89, 96, 13, 16, 0, -4),
    new Frame(76, 96, 13, 16, 0, -4),
    new Frame(63, 96, 13, 16, 0, -4), // walk-left
    new Frame(0, 112, 13, 16, 0, -4), // idle-right
    new Frame(65, 112, 13, 16, 0, -4), // jump-right
    new Frame(13, 112, 13, 16, 0, -4),
    new Frame(26, 112, 13, 16, 0, -4),
    new Frame(39, 112, 13, 16, 0, -4),
    new Frame(52, 112, 13, 16, 0, -4), // walk-right
    new Frame(81, 112, 14, 16),
    new Frame(96, 112, 16, 16), // carrot
    new Frame(112, 115, 16, 4),
    new Frame(112, 124, 16, 4),
    new Frame(112, 119, 16, 4), // grass
  ],
};

export class GameWorld {
  private friction: number;
  private gravity: number;
  private assetsManager: AssetsManager;
  private _carrots: Array<Carrot>;
  private _carrotsCount: number;
  private _grass: Array<Grass>;
  private doors: Array<Door>;
  private zone?: IZone;
  private tileSet: typeof testTileSet;
  // TODO(igolt): isso aqui vai mover pra outro lugar
  private _player: GamePlayer;
  private _height: number;
  private _width: number;
  private _columns: number;
  private _rows: number;
  private doorListeners: Array<DoorCollisionListener>;
  private carrotListeners: Array<CarrotCollisionListener>;

  public carrotsCount(): number {
    return this._carrotsCount;
  }

  public constructor(
    assetsManager: AssetsManager,
    friction?: number,
    gravity?: number
  ) {
    this.assetsManager = assetsManager;
    this.friction = friction ?? 0.85;
    this.gravity = gravity ?? 1;

    this._columns = 12;
    this._rows = 9;

    this.tileSet = testTileSet;
    // WARN(igolt): valores chutados, depois verificar isso aqui
    this._player = new GamePlayer(32, 76, assetsManager);

    this._carrots = [];
    this._carrotsCount = 0;
    this.doors = [];

    this._grass = [];

    this._height = this.tileSet.tileSize * this._rows;
    this._width = this.tileSet.tileSize * this._columns;

    this.doorListeners = [];
    this.carrotListeners = [];
  }

  public tileSize(): number {
    return this.tileSet.tileSize;
  }

  public setup(zone: IZone) {
    this._carrots = new Array();
    this.doors = new Array();
    this._grass = new Array();
    this.zone = zone;
    this._columns = zone.columns;
    this._rows = zone.rows;

    zone.carrots.forEach(carrotInfo => {
      this._carrots.push(
        new Carrot(
          carrotInfo[0] * this.tileSize() + 5,
          carrotInfo[1] * this.tileSize() - 2,
          this.assetsManager
        )
      );
    });

    zone.doors.forEach(doorInfo => {
      this.doors.push(
        new Door(
          doorInfo.x,
          doorInfo.y,
          doorInfo.width,
          doorInfo.height,
          doorInfo.destinationX,
          doorInfo.destinationY,
          doorInfo.destinationZone
        )
      );
    });

    zone.grass.forEach(grassInfo => {
      this._grass.push(
        new Grass(
          grassInfo[0] * this.tileSize(),
          grassInfo[1] * this.tileSize() + 12,
          this.assetsManager
        )
      );
    });
  }

  private getCollisionMapValue(idx: number): number {
    if (this.zone) {
      return this.zone.collisionMap[idx];
    }
    throw new Error("zone does not exist");
  }

  public collideObject(object: MovableGameObject) {
    if (!this.zone) {
      throw new Error("this.zone is undefined");
    }
    let bottom: number, left: number, right: number, top: number, value: number;
    const zone = this.zone;

    top = Math.floor(object.top() / this.tileSize());
    left = Math.floor(object.positionLeft() / this.tileSize());
    value = this.getCollisionMapValue(top * zone.columns + left);
    collide(
      value,
      object,
      left * this.tileSize(),
      top * this.tileSize(),
      this.tileSize()
    );

    top = Math.floor(object.top() / this.tileSize());
    right = Math.floor(object.positionRight() / this.tileSize());
    value = this.getCollisionMapValue(top * zone.columns + right);
    collide(
      value,
      object,
      right * this.tileSize(),
      top * this.tileSize(),
      this.tileSize()
    );

    bottom = Math.floor(object.bottom() / this.tileSize());
    left = Math.floor(object.positionLeft() / this.tileSize());
    value = this.getCollisionMapValue(bottom * zone.columns + left);
    collide(
      value,
      object,
      left * this.tileSize(),
      bottom * this.tileSize(),
      this.tileSize()
    );

    bottom = Math.floor(object.bottom() / this.tileSize());
    right = Math.floor(object.positionRight() / this.tileSize());
    value = this.getCollisionMapValue(bottom * zone.columns + right);
    collide(
      value,
      object,
      right * this.tileSize(),
      bottom * this.tileSize(),
      this.tileSize()
    );
  }

  public update() {
    this._player.updatePosition(this.gravity, this.friction);

    this.collideObject(this._player);

    for (let index = this._carrots.length - 1; index > -1; --index) {
      let carrot = this._carrots[index];

      carrot.updatePosition();
      carrot.animate();

      if (carrot.collideObject(this._player)) {
        this._carrots.splice(this._carrots.indexOf(carrot), 1);
        this._carrotsCount++;
        this.emitCarrotCollisionEvent(carrot);
      }
    }

    for (let index = this.doors.length - 1; index > -1; --index) {
      let door = this.doors[index];

      if (door.collideObjectCenter(this._player)) {
        this.emitDoorCollisionEvent(door);
      }
    }

    for (let index = this._grass.length - 1; index > -1; --index) {
      let grass = this._grass[index];

      grass.animate();
    }

    this._player.updateAnimation();
  }

  public tileSetColumns(): number {
    return this.tileSet.columns;
  }

  public tileSetRows(): number {
    return this.tileSet.rows;
  }

  public zoneId(): string {
    if (this.zone) {
      return this.zone.id;
    }
    throw new Error("zone is undefined");
  }

  public height(): number {
    return this._height;
  }

  public width(): number {
    return this._width;
  }

  public getFrame(idx: number) {
    return this.tileSet.frames[idx];
  }

  // FIX: não sei pq esses valores
  public columns(): number {
    return this._columns;
  }

  public rows(): number {
    return this._rows;
  }

  public graphicalMap() {
    if (this.zone) {
      return this.zone.graphicalMap;
    }
    throw new Error("zone undefined");
  }

  public carrots() {
    return this._carrots;
  }

  public player() {
    return this._player;
  }

  public grass() {
    return this._grass;
  }

  public addDoorCollisionEventListener(listener: DoorCollisionListener) {
    this.doorListeners.push(listener);
  }

  public addCarrotCollisionEventListener(listener: CarrotCollisionListener) {
    this.carrotListeners.push(listener);
  }

  private emitDoorCollisionEvent(door: Door) {
    this.doorListeners.forEach(listener => listener(door));
  }

  private emitCarrotCollisionEvent(carrot: Carrot) {
    this.carrotListeners.forEach(listener => listener(carrot));
  }

  public async loadSprites() {
    this._carrots.forEach(async carrot => await carrot.loadSprite());
    this._grass.forEach(async grass => await grass.loadSprite());
    await this.player().loadSprite();
  }
}
