import { Coffee } from "../Coffee";
import { Door } from "../Door";
import { GamePlayer } from "../GamePlayer";
import { IZone, ITileSet } from "../GameZone";
import { Grass } from "../Grass";
import { collide } from "../collision";
import { MovableGameObject } from "../MovableGameObject";
import { AssetsManager } from "../AssetsManager";
import { GameWorldNoZoneLoadedException } from "./GameWorldNoZoneException";
import { Collectible } from "src/Collectible";
import { Key } from "../Key";
import { SpriteSheet } from "../SpriteSheet";
import { Enemy } from "../Enemy";

type DoorCollisionListener = (door: Door) => void;
type CollectibleCollisionListener = (collectible: Collectible) => void;
type EnemyCollisionListener = (enemy: Enemy) => void;

export class GameWorld {
  private friction: number;
  private gravity: number;
  private assetsManager: AssetsManager;
  private _collectibles: Collectible[];
  private _collectiblesCount: number;
  private _grass: Grass[];
  private _enemies: Enemy[];
  private doors: Door[];
  private zone?: IZone;
  private tileSet: ITileSet;
  // TODO(igolt): isso aqui vai mover pra outro lugar
  private _player: GamePlayer;
  // NOTE(igolt): Não sei se esses atributos ainda vão ficar aqui
  private _height: number;
  private _width: number;
  private _columns: number;
  private _rows: number;
  private doorListeners: DoorCollisionListener[];
  private enemyEventListeners: EnemyCollisionListener[];
  private collectiblesEventListeners: CollectibleCollisionListener[];
  private collectibleState: Map<string, Collectible[]>;
  private lastCollionTime: number;

  public collectibleCount(): number {
    return this._collectiblesCount;
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

    this.tileSet = {
      spriteSheet: new SpriteSheet(assetsManager, {
        key: "-",
        url: "-",
      }),
      columns: 8,
      rows: 8,
      tileSize: 16,
    };
    this._player = new GamePlayer(32, 50, assetsManager);

    this._collectibles = [];
    this._collectiblesCount = 0;
    this.doors = [];

    this._grass = [];
    this._enemies = [];

    this._height = this.tileSet.tileSize * this._rows;
    this._width = this.tileSet.tileSize * this._columns;

    this.collectibleState = new Map<string, Collectible[]>();
    this.doorListeners = [];
    this.enemyEventListeners = [];
    this.collectiblesEventListeners = [];
    this.lastCollionTime = 0;
  }

  public tileSize(): number {
    return this.tileSet.tileSize;
  }

  public setup(zone: IZone) {
    if (this.zone) {
      this.collectibleState.set(this.zone.id, this._collectibles);
    }
    this.doors = [];
    this._grass = [];
    this._enemies = [];
    this.zone = zone;
    this._columns = zone.columns;
    this._rows = zone.rows;
    this.tileSet = zone.tileSet;

    const saveCollectibles = this.collectibleState.get(zone.id);

    if (saveCollectibles) {
      this._collectibles = saveCollectibles;
    } else {
      this._collectibles = [];
      zone.coffees.forEach(coffeeInfo => {
        this._collectibles.push(
          new Coffee(
            coffeeInfo[0] * this.tileSize() + 5,
            coffeeInfo[1] * this.tileSize() - 2,
            this.assetsManager
          )
        );
      });

      zone.keys.forEach(keyInfo => {
        this._collectibles.push(
          new Key(
            keyInfo[0] * this.tileSize() + 5,
            keyInfo[1] * this.tileSize() - 2,
            keyInfo[2],
            this.assetsManager
          )
        );
      });
    }

    zone.enemies.forEach(enemyInfo => {
      this._enemies.push(
        new Enemy(
          enemyInfo[0] * this.tileSize() + 5,
          enemyInfo[1] * this.tileSize() - 2,
          this._player,
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
          doorInfo.destinationZone,
          doorInfo.lock
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
    throw new GameWorldNoZoneLoadedException("getCollisionMapValue");
  }

  public collideObject(object: MovableGameObject) {
    if (!this.zone) {
      throw new GameWorldNoZoneLoadedException("collideObject");
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

  public update(dt: number) {
    this._player.updatePosition(this.gravity, this.friction);

    this.collideObject(this._player);

    for (let index = this._collectibles.length - 1; index > -1; --index) {
      const coffee = this._collectibles[index];

      coffee.updatePosition();
      coffee.animate();

      if (coffee.collideObject(this._player)) {
        this._collectibles.splice(this._collectibles.indexOf(coffee), 1);
        this._collectiblesCount += coffee.points();
        this.emitCollectibleCollisionEvent(coffee);
      }
    }

    for (let index = this.doors.length - 1; index > -1; --index) {
      const door = this.doors[index];

      if (door.collideObjectCenter(this._player)) {
        this.emitDoorCollisionEvent(door);
      }
    }

    for (let index = this._enemies.length - 1; index > -1; --index) {
      const enemy = this._enemies[index];

      enemy.updatePosition(this.gravity, this.friction);
      enemy.updateAnimation();
      this.collideObject(enemy);

      if (dt - this.lastCollionTime > 1000) {
        if (enemy.collideObject(this._player)) {
          this.emitEnemyCollisionEvent(enemy);
          this.lastCollionTime = dt;
        }
      }
    }

    for (let index = this._grass.length - 1; index > -1; --index) {
      const grass = this._grass[index];

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
    throw new GameWorldNoZoneLoadedException("zoneId");
  }

  public height(): number {
    return this._height;
  }

  public width(): number {
    return this._width;
  }

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
    throw new GameWorldNoZoneLoadedException("graphicalMap");
  }

  public collectibles() {
    return this._collectibles;
  }

  public player() {
    return this._player;
  }

  public grass() {
    return this._grass;
  }

  public enemies() {
    return this._enemies;
  }

  public addDoorCollisionEventListener(listener: DoorCollisionListener) {
    this.doorListeners.push(listener);
  }

  public addEnemyCollisionEventListener(listener: EnemyCollisionListener) {
    this.enemyEventListeners.push(listener);
  }

  public addCollectibleEventListener(listener: CollectibleCollisionListener) {
    this.collectiblesEventListeners.push(listener);
  }

  private emitDoorCollisionEvent(door: Door) {
    this.doorListeners.forEach(listener => listener(door));
  }

  private emitCollectibleCollisionEvent(collectible: Collectible) {
    this.collectiblesEventListeners.forEach(listener => listener(collectible));
  }

  private emitEnemyCollisionEvent(enemy: Enemy) {
    this.enemyEventListeners.forEach(listener => listener(enemy));
  }

  public async loadSprites() {
    if (this.zone) {
      await this.zone.loadSprite();
    }
    this._collectibles.forEach(async c => await c.loadSprite());
    this._grass.forEach(async grass => await grass.loadSprite());
    this._enemies.forEach(async enemy => await enemy.loadSprite());
    await this.player().loadSprite();
  }

  public tileSetImage() {
    if (this.zone) {
      return this.zone.tileSetImage();
    }
    throw new GameWorldNoZoneLoadedException("tileSetImage");
  }

  public zoneQuestion() {
    return this.zone?.question;
  }
}
