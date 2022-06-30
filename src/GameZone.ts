import { AssetsManager } from "./AssetsManager";
import { SpriteSheet } from "./Animation";

// REFACTOR(igolt): muita coisa misturada

export interface TileSet {
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

type GraphicalMap = Array<number>;
type CollisionMap = Array<number>;

interface IZoneBase {
  id: string;

  tileSet: TileSet;
  coffees: Array<CoffeeInfo>;
  grass: Array<GrassInfo>;
  doors: Array<DoorInfo>;

  tileSetImage: () => HTMLImageElement;

  columns: number;
  rows: number;
}

export type IZone = IZoneBase & {
  assetsManager: AssetsManager;
  graphicalMap: GraphicalMap;
  collisionMap: CollisionMap;
  loadSprite: () => Promise<void>;
};

type ZoneInfo = IZoneBase & {
  graphicalMap: Array<[number, number, number]> | Array<number>;
  collisionMap?: Array<number>;
};

const isImage = (obj: any): obj is HTMLImageElement =>
  obj instanceof HTMLImageElement;

const ZONE_PREFIX = "../zones/zone";
const ZONE_SUFFIX = ".json";

const _getZoneUrlById = (id: string) => ZONE_PREFIX + id + ZONE_SUFFIX;

// TODO(igolt): fazer a validação da zona
const isZoneInfo = (_: any): _ is ZoneInfo => true;

const hasCollisionMap = (zoneInfo: any) => "collisionMap" in zoneInfo;

const parseGraphicalAndCollisionMap = (zoneInfo: any) => {
  const newGraphicalMap: number[] = [];
  const collisionMap: number[] = [];

  zoneInfo.graphicalMap.forEach((value: [number, number, number]) => {
    newGraphicalMap.push(value[0] * zoneInfo.columns + value[1]);
    collisionMap.push(value[2]);
  });

  (zoneInfo as any).graphicalMap = newGraphicalMap;
  zoneInfo = Object.assign(zoneInfo, { collisionMap });

  return zoneInfo as any as IZone;
};

// TODO(igolt): fazer função de conversão
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
