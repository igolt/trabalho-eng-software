export class GameWorldNoZoneLoadedException extends Error {
  constructor(method: string) {
    super(`GameWorld::${method}: no zone is loaded`);
    this.name = GameWorldNoZoneLoadedException.name;
  }
}
