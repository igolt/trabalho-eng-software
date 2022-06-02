import { Game } from "../game.js";
import { GameState } from "../gameState.js";
import { IGameStatus } from "../gamestatus.js";
import { Match } from "../match.js";
import { Phase } from "../phase.js";
import { Scenery } from "../scenery.js";
import { IImages, Images } from "./images.js";
import { Scene1 } from "./scene1.js";

export function jogar() {

    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    if (ctx) {

        var images: IImages = new Images();

        images.load("background", "../../assets/toyroom.png", () => {

            images.load("bear.png", "../../assets/bear.png", () => {

                var scenery = new Scenery<string>('scenery1', [new Scene1(ctx!, images)]);
                var phase = new Phase<string>('phase1', [scenery]);
                var game = new Game<string>('game1', [phase]);

                var match = new Match('match', 3, 30000, 33);

                var gs = new class implements IGameStatus<string>{

                    player: string = 'player1';
                    score: number = 0;
                    life: number = 0;
                    scene: string = '';
                    scenery: string = '';
                    phase: string = '';
                    game: string = '';
                    gameState: GameState = GameState.GameNext;

                }();

                match.game(game, gs);

            });

        });
    }
}