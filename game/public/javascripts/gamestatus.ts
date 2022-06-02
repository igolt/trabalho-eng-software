import { IGame } from "./game.js";
import { GameState } from "./gameState.js";
import { IPlayer } from "./player.js";

export interface IGameStatus<ID>{
    player:ID;
    score:number;
    life:number;
    scene:ID | undefined;
    scenery:ID | undefined;
    phase:ID | undefined;
    game:ID | undefined;
    gameState:GameState;
}