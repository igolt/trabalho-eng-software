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

export interface IZone {
  id: string;

  carrots: Array<CarrotInfo>;
  grass: Array<GrassInfo>;
  doors: Array<DoorInfo>;

  columns: number;
  rows: number;

  graphicalMap: GraphicalMap;
  collisionMap: CollisionMap;
}

const ZONE_PREFIX = "../zones/zone";
const ZONE_SUFFIX = ".json";

// TODO(igolt): fazer a validação da zona
const validateZone = (_: any): _ is IZone => true;

const _zoneURL = (id: string) => ZONE_PREFIX + id + ZONE_SUFFIX;

const zones: { readonly [statusCode: string]: string | null } = {
  "00": _zoneURL("00"),
  "05": _zoneURL("05"),
};

export const requestZoneFromJSON = async (
  assetsManager: AssetsManager,
  zoneId: string
): Promise<IZone> => {
  const zoneUrl = zones[zoneId];

  if (zoneUrl == null) {
    throw new Error("requestZoneFromJSON: invalid zone ID");
  }

  const zone = await assetsManager.getOrLoadJSON(zoneId.toString(), zoneUrl);

  if (validateZone(zone)) {
    return zone;
  }
  throw new Error("requestZoneFromJSON: invalid JSON format for zone.");
};
