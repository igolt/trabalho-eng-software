import { AssetsManager } from "./AssetsManager";
import { SpriteSheet } from "./Animation";

export interface ITileSet {
  spriteSheet: SpriteSheet;
  columns: number;
  rows: number;
  tileSize: number;
}

type CoffeeInfo = [number, number];
type GrassInfo = [number, number];

type DoorInfo = {
  x: number;
  y: number;

  width: number;
  height: number;

  destinationZone: string;
  destinationX: number;
  destinationY: number;
};

type GraphicalMap = number[];
type CollisionMap = number[];

interface IZoneBase {
  id: string;

  columns: number;
  rows: number;

  tileSet: ITileSet;
  coffees: CoffeeInfo[];
  grass: GrassInfo[];
  doors: DoorInfo[];

  tileSetImage(): HTMLImageElement;
}

export type IZone = IZoneBase & {
  assetsManager: AssetsManager;
  graphicalMap: GraphicalMap;
  collisionMap: CollisionMap;
  loadSprite: () => Promise<void>;
};

type ZoneInfoWithCollisionMap = IZoneBase & {
  graphicalMap: number[];
  collisionMap?: number[];
};

type ZoneInfoWithoutCollisionMap = IZoneBase & {
  graphicalMap: [number, number, number][];
};

type ZoneInfo = ZoneInfoWithCollisionMap | ZoneInfoWithoutCollisionMap;

const isImage = (obj: any): obj is HTMLImageElement =>
  obj instanceof HTMLImageElement;

const ZONE_PREFIX = "../zones/zone";
const ZONE_SUFFIX = ".json";

const _getZoneUrlById = (id: string) => ZONE_PREFIX + id + ZONE_SUFFIX;

// TODO(igolt): fazer a validação da zona
const isZoneInfo = (_: any): _ is ZoneInfo => true;

const hasCollisionMap = (
  zoneInfo: ZoneInfo
): zoneInfo is ZoneInfoWithCollisionMap => "collisionMap" in zoneInfo;

const parseGraphicalAndCollisionMap = (
  zoneInfo: ZoneInfoWithoutCollisionMap
) => {
  const newGraphicalMap: number[] = [];
  const collisionMap: number[] = [];

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

const zoneInfoToZone = (zoneInfo: any, assetsManager: AssetsManager): IZone => {
  if (!hasCollisionMap(zoneInfo)) {
    zoneInfo = parseGraphicalAndCollisionMap(zoneInfo);
  }

  const zone: IZone = zoneInfo as IZone;

  return Object.assign(zoneInfo, {
    assetsManager: assetsManager,

    loadSprite: async () => {
      if (!isImage(zone.tileSet.spriteSheet)) {
        zone.tileSet.spriteSheet = await assetsManager.getOrLoadImage(
          zone.tileSet.spriteSheet.key,
          zone.tileSet.spriteSheet.url
        );
      }
    },

    tileSetImage: () => {
      if (isImage(zone.tileSet.spriteSheet)) {
        return zone.tileSet.spriteSheet;
      }
      throw new Error("Zone::tileSetImage: spritesheet not loaded");
    },
  });
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
