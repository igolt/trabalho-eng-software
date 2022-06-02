import { IGame } from "./game.js";
import { IGameStatus } from "./gamestatus.js";
import { IScene } from "./scene.js";
import { GameState } from "./gameState.js";

export interface IMatch<ID> {

    id:ID;
    game(game: IGame<ID>, gameStatus: IGameStatus<ID>): void;

}

export class Match<ID> implements IMatch<ID>{

    constructor(   
        public id:ID,     
        private life:number = 3,
        private gameTimeout:number = 60000,
        private elapse: number = 33) { }

    game(game: IGame<ID>, gameStatus: IGameStatus<ID>): void {

        gameStatus.score = 0;
        gameStatus.life = this.life;
        gameStatus.game = game.id;
        gameStatus.gameState = GameState.GameRunning;

        let scene = game.next();

        if (scene !== undefined) {

            gameStatus.scenery = game.currentSceneryId();
            gameStatus.phase = game.currentPhaseId();
            scene.gameStatus(gameStatus);

            var timeout: NodeJS.Timeout;

            let timer = setInterval(() => {

                scene!.time(this.elapse);

                if (gameStatus.gameState === GameState.GameOver || gameStatus.life <= 0) {

                    clearInterval(timer);
                    if(timeout)clearTimeout(timeout);

                } else if (gameStatus.gameState === GameState.GameNext) {

                    scene = game.next();

                    if (scene !== undefined) {

                        gameStatus.scenery = game.currentSceneryId();
                        gameStatus.phase = game.currentPhaseId();
                        scene.gameStatus(gameStatus);

                    } else {

                        gameStatus.gameState = GameState.GameOver;
                        clearInterval(timer);
                        if(timeout)clearTimeout(timeout);

                    }

                }

            }, this.elapse);

            timeout = setTimeout(() => {

                if(timer) clearInterval(timer);
                
            }, this.gameTimeout);

        }

    }

}