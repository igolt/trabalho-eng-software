export var GameState;
(function (GameState) {
    GameState[GameState["GameOver"] = 0] = "GameOver";
    GameState[GameState["GameRunning"] = 1] = "GameRunning";
    GameState[GameState["GameNext"] = 2] = "GameNext";
})(GameState || (GameState = {}));
