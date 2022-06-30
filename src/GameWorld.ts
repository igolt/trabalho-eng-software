import { Coffee } from "./Coffee";
import { Door } from "./Door";
import { GamePlayer } from "./GamePlayer";
import { IZone, TileSet } from "./GameZone";
import { Grass } from "./Grass";
import { collide } from "./collision";
import { MovableGameObject } from "./MovableGameObject";
import { AssetsManager } from "./AssetsManager";

type DoorCollisionListener = (door: Door) => void;
type CoffeeCollisionListener = (coffee: Coffee) => void;

// WARN(igolt): remover isso depois
const defaultTileSet = {
  spriteSheet: {
    key: "invalid-key",
    url: "invalid-url",
  },
  columns: 8,
  rows: 8,
  tileSize: 16,
};

export class GameWorld {
  private friction: number;
  private gravity: number;
  private assetsManager: AssetsManager;
  private _coffees: Array<Coffee>;
  private _coffeesCount: number;
  private _grass: Array<Grass>;
  private doors: Array<Door>;
  private zone?: IZone;
  private tileSet: TileSet;
  // TODO(igolt): isso aqui vai mover pra outro lugar
  private _player: GamePlayer;
  private _height: number;
  private _width: number;
  private _columns: number;
  private _rows: number;
  private doorListeners: Array<DoorCollisionListener>;
  private coffeeListeners: Array<CoffeeCollisionListener>;
  private coffeeState: Map<string, Coffee[]>;

  public coffeeCount(): number {
    return this._coffeesCount;
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

    this.tileSet = defaultTileSet;
    // WARN(igolt): valores chutados, depois verificar isso aqui
    this._player = new GamePlayer(32, 76, assetsManager);

    this._coffees = [];
    this._coffeesCount = 0;
    this.doors = [];

    this._grass = [];

    this._height = this.tileSet.tileSize * this._rows;
    this._width = this.tileSet.tileSize * this._columns;

    this.coffeeState = new Map<string, Coffee[]>();
    this.doorListeners = [];
    this.coffeeListeners = [];
  }

  public tileSize(): number {
    return this.tileSet.tileSize;
  }

  public setup(zone: IZone) {
    if (this.zone) {
      this.coffeeState.set(this.zone.id, this._coffees);
    }
    this.doors = new Array();
    this._grass = new Array();
    this.zone = zone;
    this._columns = zone.columns;
    this._rows = zone.rows;
    this.tileSet = zone.tileSet;

    const saveCoffees = this.coffeeState.get(zone.id);

    if (saveCoffees) {
      this._coffees = saveCoffees;
    } else {
      this._coffees = new Array();
      zone.coffees.forEach(coffeeInfo => {
        this._coffees.push(
          new Coffee(
            coffeeInfo[0] * this.tileSize() + 5,
            coffeeInfo[1] * this.tileSize() - 2,
            this.assetsManager
          )
        );
      });
    }

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

    for (let index = this._coffees.length - 1; index > -1; --index) {
      let coffee = this._coffees[index];

      coffee.updatePosition();
      coffee.animate();

      if (coffee.collideObject(this._player)) {
        this._coffees.splice(this._coffees.indexOf(coffee), 1);
        this._coffeesCount++;
        this.emitCoffeeCollisionEvent(coffee);
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

  public coffees() {
    return this._coffees;
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

  public addCoffeeEventListener(listener: CoffeeCollisionListener) {
    this.coffeeListeners.push(listener);
  }

  private emitDoorCollisionEvent(door: Door) {
    this.doorListeners.forEach(listener => listener(door));
  }

  private emitCoffeeCollisionEvent(coffee: Coffee) {
    this.coffeeListeners.forEach(listener => listener(coffee));
  }

  public async loadSprites() {
    if (this.zone) {
      await this.zone.loadSprite();
    }
    this._coffees.forEach(async coffee => await coffee.loadSprite());
    this._grass.forEach(async grass => await grass.loadSprite());
    await this.player().loadSprite();
  }

  public tileSetImage() {
    if (!this.zone) {
      throw new Error("GameWorld::tileSetImage: no zone loaded");
    }
    return this.zone.tileSetImage();
  }
}
