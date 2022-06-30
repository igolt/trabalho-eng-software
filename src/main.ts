import { GameWorld } from "./GameWorld";
import { Engine } from "./Engine";
import { Display } from "./Display";
import { Controller } from "./Controller";
import { requestZoneFromJSON } from "./GameZone";
import { Door } from "./Door";
import { AssetsManager } from "./AssetsManager";

window.addEventListener("load", async () => {
  "use strict";

  //// CONSTANTS ////

  const INITIAL_ZONE_ID = "00";

  ///////////////////
  //// FUNCTIONS ////
  ///////////////////

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      gameWorld.height() / gameWorld.width()
    );
    display.render();

    const rectangle = display.getBoundingClientRect();

    pStats.style.left = rectangle.left + "px";
    pStats.style.top = rectangle.top + "px";
    pStats.style.fontSize =
      (gameWorld.tileSize() * rectangle.height) / gameWorld.height() + "px";
  };

  const render = () => {
    display.drawMap(
      gameWorld.tileSetImage(),
      gameWorld.tileSetColumns(),
      // gameWorld.tileSetRows(),
      gameWorld.graphicalMap(),
      gameWorld.columns(),
      // gameWorld.rows(),
      gameWorld.tileSize()
    );

    for (let index = gameWorld.coffees().length - 1; index > -1; --index) {
      const coffee = gameWorld.coffees()[index];
      const frame = coffee.frame();

      display.drawObject(
        coffee.spriteSheet(),
        frame.x,
        frame.y,
        coffee.getX() +
          Math.floor(coffee.width() * 0.5 - frame.width * 0.5) +
          frame.offsetX,
        coffee.getY() + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    const frame = gameWorld.player().frame();

    display.drawObject(
      gameWorld.player().spriteSheet(),
      frame.x,
      frame.y,
      gameWorld.player().getX() +
        Math.floor(gameWorld.player().width() * 0.5 - frame.width * 0.5) +
        frame.offsetX,
      gameWorld.player().getY() + frame.offsetY,
      frame.width,
      frame.height
    );

    for (let index = gameWorld.grass().length - 1; index > -1; --index) {
      const grass = gameWorld.grass()[index];
      const frame = grass.frame();

      display.drawObject(
        grass.spriteSheet(),
        frame.x,
        frame.y,
        grass.x + frame.offsetX,
        grass.y + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    display.render();
  };

  const coffeeCollisionListener = () =>
    (pStats.innerHTML = "Coffee: " + gameWorld.coffeeCount());

  const playerController = () => {
    if (controller.left.isDown()) {
      gameWorld.player().moveLeft();
    }
    if (controller.right.isDown()) {
      gameWorld.player().moveRight();
    }
    if (controller.up.isActive()) {
      gameWorld.player().jump();
      controller.up.deactivate();
    }
  };

  const update = () => {
    playerController();
    gameWorld.update();
  };

  const movePlayerToDoorDestination = (door: Door) => {
    if (door.destinationX != -1) {
      gameWorld.player().setCenterX(door.destinationX);
      gameWorld.player().setOldCenterX(door.destinationX); // It's important to reset the old position as well.
    }

    if (door.destinationY != -1) {
      gameWorld.player().setCenterY(door.destinationY);
      gameWorld.player().setOldCenterY(door.destinationY);
    }
  };

  const doorCollisionEventListener = (door: Door) => {
    if (door.destinationZone == gameWorld.zoneId()) {
      movePlayerToDoorDestination(door);
    } else {
      engine.stop();

      requestZoneFromJSON(assetsManager, door.destinationZone).then(zone => {
        gameWorld.setup(zone);

        gameWorld.loadSprites().then(() => {
          movePlayerToDoorDestination(door);

          engine.start();
        });
      });
    }
  };

  /////////////////
  //// OBJECTS ////
  /////////////////

  const controller = new Controller();
  const display = new Display();
  const assetsManager = new AssetsManager();
  const gameWorld = new GameWorld(assetsManager);
  const engine = new Engine(1000 / 30, render, update);

  const pStats = document.createElement("pStats");
  pStats.setAttribute(
    "style",
    "color:#ffffff; font-size:2.0em; position:fixed"
  );
  pStats.innerHTML = "Coffee: 0";

  ////////////////////
  //// INITIALIZE ////
  ////////////////////

  display.setBufferCanvasHeight(gameWorld.height());
  display.setBufferCanvasWidth(gameWorld.width());
  display.disableImageSmoothing();

  window.addEventListener("resize", resize);

  const startScreen = await assetsManager.getOrLoadImage(
    "game-menu",
    "sprite_sheets/menu.png"
  );

  let gameStarted = false;

  display.drawImage(startScreen);

  window.addEventListener("keydown", e => {
    if (e.key == " " && !gameStarted) {
      gameStarted = true;
      requestZoneFromJSON(assetsManager, INITIAL_ZONE_ID).then(async zone => {
        gameWorld.setup(zone);
        gameWorld.addDoorCollisionEventListener(doorCollisionEventListener);
        gameWorld.addCoffeeEventListener(coffeeCollisionListener);

        gameWorld.loadSprites().then(() => {
          document.body.appendChild(pStats);
          resize();
          engine.start();
        });
      });
    }
  });
});
