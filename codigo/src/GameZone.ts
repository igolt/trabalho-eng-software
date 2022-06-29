import { AssetsManager } from "./AssetsManager";

type CarrotInfo = [number, number];
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

  carrots: Array<CarrotInfo>;
  grass: Array<GrassInfo>;
  doors: Array<DoorInfo>;

  columns: number;
  rows: number;
}

export type IZone = IZoneBase & {
  graphicalMap: GraphicalMap;
  collisionMap: CollisionMap;
};

type ZoneInfo = IZoneBase & {
  graphicalMap: Array<[number, number, number]>;
};

const ZONE_PREFIX = "../zones/zone";
const ZONE_SUFFIX = ".json";
const _zoneURL = (id: string) => ZONE_PREFIX + id + ZONE_SUFFIX;

const zones: { readonly [statusCode: string]: string | null } = {
  "00": _zoneURL("00"),
  "05": _zoneURL("05"),
};

const _getZoneUrlById = (zoneId: string) => {
  const zoneUrl = zones[zoneId];

  if (zoneUrl == null) {
    throw new Error("requestZoneFromJSON: invalid zone ID");
  }
  return zoneUrl;
};

// TODO(igolt): fazer a validação da zona
const isZoneInfo = (_: any): _ is ZoneInfo => true;

// TODO(igolt): fazer a validação da zona
const isZone = (obj: any): obj is IZone => {
  if (!("graphicalMap" in obj)) {
    return false;
  }
  const graphicalMap = obj["graphicalMap"];
  const firstElement = graphicalMap[0];

  if (firstElement == null || firstElement == undefined) {
    return true;
  }
  return typeof firstElement == "number";
};

// TODO(igolt): fazer função de conversão
const zoneInfoToZone = (zoneInfo: ZoneInfo): IZone => {
  const newGraphicalMap: number[] = [];
  const collisionMap: number[] = [];

  zoneInfo.graphicalMap.forEach(value => {
    newGraphicalMap.push(value[0] * zoneInfo.columns + value[1]);
    collisionMap.push(value[2]);
  });

  (zoneInfo as any).graphicalMap = newGraphicalMap;
  zoneInfo = Object.assign(zoneInfo, { collisionMap });

  return zoneInfo as any as IZone;
};

export const requestZoneFromJSON = async (
  assetsManager: AssetsManager,
  zoneId: string
): Promise<IZone> => {
  const zoneUrl = _getZoneUrlById(zoneId);
  const zone = await assetsManager.getOrLoadJSON(zoneId, zoneUrl);

  if (isZone(zone)) {
    console.log("loading old zone format");
    return zone;
  } else if (isZoneInfo(zone)) {
    console.log("loading new zone format");
    return zoneInfoToZone(zone);
  }
  throw new Error("requestZoneFromJSON: invalid JSON format for zone.");
};
