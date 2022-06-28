import { requestJSON } from "./assets-utils";

type URLType = Parameters<typeof requestJSON>[0];

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

const validateZone = (_: any): _ is IZone => true;

export const requestZoneFromJSON = async (url: URLType): Promise<IZone> => {
  const zone = await requestJSON(url);

  if (validateZone(zone)) {
    return zone;
  }
  throw Error("requestZoneFromJSON: invalid JSON format for zone.");
};
