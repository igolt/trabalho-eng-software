import { Game } from "../game.js";
import { GameState } from "../gameState.js";
import { Match } from "../match.js";
import { Phase } from "../phase.js";
import { Scenery } from "../scenery.js";
import { Images } from "./images.js";
import { Scene1 } from "./scene1.js";
export function jogar() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    if (ctx) {
        var images = new Images();
        images.load("background", "../../assets/toyroom.png", () => {
            images.load("bear.png", "../../assets/bear.png", () => {
                var scenery = new Scenery('scenery1', [new Scene1(ctx, images)]);
                var phase = new Phase('phase1', [scenery]);
                var game = new Game('game1', [phase]);
                var match = new Match('match', 3, 30000, 33);
                var gs = new class {
                    constructor() {
                        this.player = 'player1';
                        this.score = 0;
                        this.life = 0;
                        this.scene = '';
                        this.scenery = '';
                        this.phase = '';
                        this.game = '';
                        this.gameState = GameState.GameNext;
                    }
                }();
                match.game(game, gs);
            });
        });
    }
}
