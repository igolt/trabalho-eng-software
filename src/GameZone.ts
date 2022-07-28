import { AssetsManager } from "./AssetsManager";
import { Sprite, SpriteSheet } from "./SpriteSheet";

interface ITileSetBase {
  columns: number;
  rows: number;
  tileSize: number;
}

interface ITileSetInfo extends ITileSetBase {
  spriteSheet: Sprite;
}

export interface ITileSet extends ITileSetBase {
  spriteSheet: SpriteSheet;
}

type CoffeeInfo = [number, number];
type GrassInfo = [number, number];
type KeyInfo = [number, number, string];
type EnemyInfo = [number, number];

type DoorInfo = {
  x: number;
  y: number;

  width: number;
  height: number;

  destinationZone: string;
  destinationX: number;
  destinationY: number;
  lock?: string;
};

type GraphicalMap = number[];
type CollisionMap = number[];

interface IZoneBase {
  id: string;

  columns: number;
  rows: number;

  coffees: CoffeeInfo[];
  grass: GrassInfo[];
  doors: DoorInfo[];
}

export interface IZone extends IZoneBase {
  question?: string;
  keys: KeyInfo[];
  assetsManager: AssetsManager;
  graphicalMap: GraphicalMap;
  collisionMap: CollisionMap;
  tileSet: ITileSet;
  loadSprite: () => Promise<void>;
  tileSetImage(): HTMLImageElement;
  enemies: EnemyInfo[];
}

interface IZoneInfoBase extends IZoneBase {
  tileSet: ITileSetInfo;
  keys?: KeyInfo[];
  enemies?: EnemyInfo[];
}

type ZoneInfoWithCollisionMap = IZoneInfoBase & {
  graphicalMap: number[];
  collisionMap: number[];
};

type ZoneInfoWithoutCollisionMap = IZoneInfoBase & {
  graphicalMap: [number, number, number][];
};

type ZoneInfo = ZoneInfoWithCollisionMap | ZoneInfoWithoutCollisionMap;

const ZONE_PREFIX = "../zones/zone";
const ZONE_SUFFIX = ".json";

const _getZoneUrlById = (id: string) => ZONE_PREFIX + id + ZONE_SUFFIX;

// TODO(igolt): fazer a validação da zona
const isZoneInfo = (_: unknown): _ is ZoneInfo => true;

const hasCollisionMap = (
  zoneInfo: ZoneInfo
): zoneInfo is ZoneInfoWithCollisionMap => "collisionMap" in zoneInfo;

const parseGraphicalAndCollisionMap = (
  zoneInfo: ZoneInfoWithoutCollisionMap
): ZoneInfoWithCollisionMap => {
  const newGraphicalMap: GraphicalMap = [];
  const collisionMap: CollisionMap = [];

  zoneInfo.graphicalMap.forEach(value => {
    newGraphicalMap.push(value[0] * zoneInfo.columns + value[1]);
    collisionMap.push(value[2]);
  });

  return {
    ...zoneInfo,
    graphicalMap: newGraphicalMap,
    collisionMap,
  };
};

const zoneInfoToZone = (
  zoneInfo: ZoneInfo,
  assetsManager: AssetsManager
): IZone => {
  const zone: ZoneInfoWithCollisionMap = hasCollisionMap(zoneInfo)
    ? zoneInfo
    : parseGraphicalAndCollisionMap(zoneInfo);

  const spriteSheet = new SpriteSheet(assetsManager, zone.tileSet.spriteSheet);

  return {
    ...zone,
    assetsManager: assetsManager,
    loadSprite: () => spriteSheet.load(),
    tileSetImage: () => spriteSheet.image(),
    keys: zoneInfo.keys ?? [],
    enemies: zoneInfo.enemies ?? [],
    tileSet: {
      ...zone.tileSet,
      spriteSheet: spriteSheet,
    },
  };
};

export const requestZoneFromJSON = async (
  assetsManager: AssetsManager,
  zoneId: string
): Promise<IZone> => {
  const zoneUrl = _getZoneUrlById(zoneId);
  const zone = await assetsManager.getOrLoadJSON(zoneId, zoneUrl);

  if (isZoneInfo(zone)) {
    return zoneInfoToZone(zone, assetsManager);
  }
  throw new Error("requestZoneFromJSON: invalid JSON format for zone.");
};
