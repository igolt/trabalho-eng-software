import { GameState } from "./gameState.js";
export class Match {
    constructor(id, life = 3, gameTimeout = 60000, elapse = 33) {
        this.id = id;
        this.life = life;
        this.gameTimeout = gameTimeout;
        this.elapse = elapse;
    }
    game(game, gameStatus) {
        gameStatus.score = 0;
        gameStatus.life = this.life;
        gameStatus.game = game.id;
        gameStatus.gameState = GameState.GameRunning;
        let scene = game.next();
        if (scene !== undefined) {
            gameStatus.scenery = game.currentSceneryId();
            gameStatus.phase = game.currentPhaseId();
            scene.gameStatus(gameStatus);
            var timeout;
            let timer = setInterval(() => {
                scene.time(this.elapse);
                if (gameStatus.gameState === GameState.GameOver || gameStatus.life <= 0) {
                    clearInterval(timer);
                    if (timeout)
                        clearTimeout(timeout);
                }
                else if (gameStatus.gameState === GameState.GameNext) {
                    scene = game.next();
                    if (scene !== undefined) {
                        gameStatus.scenery = game.currentSceneryId();
                        gameStatus.phase = game.currentPhaseId();
                        scene.gameStatus(gameStatus);
                    }
                    else {
                        gameStatus.gameState = GameState.GameOver;
                        clearInterval(timer);
                        if (timeout)
                            clearTimeout(timeout);
                    }
                }
            }, this.elapse);
            timeout = setTimeout(() => {
                if (timer)
                    clearInterval(timer);
            }, this.gameTimeout);
        }
    }
}
