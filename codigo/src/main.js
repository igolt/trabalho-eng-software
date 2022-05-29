import { AssetsManager } from "./AssetsManager.js";
import { GameMap } from "./GameMap.js";
import { Scene } from "./Scene.js";
import { Sprite } from "./Sprite.js";

//assets gerais: sprites, musicas, etc
var assetsMng = new AssetsManager();
assetsMng.loadImage("bear", "./assets/bear.png");
assetsMng.loadImage("charger", "./assets/charger.png");

//assets de mapas
var mapAssets = new AssetsManager();
mapAssets.loadImage("background1", "./assets/toyroom.png");
mapAssets.loadImage("voidtile", "./assets/voidtile.png");

var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 640;

var ctx = canvas.getContext("2d");
var keys = {
  arrowLeft: 0,
  arrowUp: 0,
  arrowRight: 0,
  arrowDown: 0,
  space: 0,
};

//MAPAS

var gameMaps = [];
var map0 = new GameMap({
  mapAssets: mapAssets,
  mapindice: 0,
  COLUMNS: 25,
  LINES: 20,
  m: [
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
});
map0.assets = mapAssets;
gameMaps.push(map0);

///COMPORTAMENTOS
const playerController = keys => {
  return function () {
    if (keys.arrowLeft) {
      (this.ax = -300), (this.side = 0);
    }
    if (keys.arrowRight) {
      (this.ax = +300), (this.side = 1);
    }
    if (keys.arrowLeft === keys.arrowRight) {
      this.ax = 0;
    }
    if (keys.arrowUp && this.cooldown <= 0) {
      this.cooldown = 1.0;
      this.vy = -500;
    }
    if (this.jump >= 0.5) {
      (this.jump = 0), (this.vy = -800);
    }
    if (keys.arrowUp === keys.arrowDown) {
      this.ay = 0;
    }
    if (keys.space && this.cooldown <= 0 && this.dialogo <= 0) {
      if (this.side <= 0.5) {
        var shoot = new Sprite({
          side: 0,
          x: this.x - 48,
          y: this.y - 8,
          ax: -1,
          vx: -600,
          width: 24,
          h: 24,
          props: { tipo: "shoot" },
        });
        this.scene.addSprite(shoot);
        this.cooldown = 0.25;
      } else {
        var shoot = new Sprite({
          side: 1,
          x: this.x + 48,
          y: this.y - 8,
          ax: 1,
          vx: 600,
          width: 24,
          h: 24,
          props: { tipo: "shoot" },
        });
        this.scene.addSprite(shoot);
        this.cooldown = 0.25;
      }
    }
  };
};

// TODO: mover isso pra algum lugar
// const followTarget = target => {
//   return () => {
//     if (
//       Math.sqrt((target.x - this.x) * (target.x - this.x)) +
//         (target.y - this.y) * (target.y - this.y) <=
//       200
//     ) {
//       if (target.x <= this.x) {
//         this.lado = 0;
//       } else {
//         this.lado = 1;
//       }
//       this.ax = 200 * Math.sign(target.x - this.x);
//     }
//   };
// };

var pc = new Sprite({
  x: 120,
  y: 440,
  width: 24,
  h: 24,
  vx: 20,
  vy: 20,
  behave: playerController(keys),
  props: { tipo: "pc", riding: 0 },
});

var gameScene = new Scene({
  ctx: ctx,
  width: canvas.width,
  height: canvas.height,
  assets: assetsMng,
  map: gameMaps,
  mapAssets,
  pc: pc,
});

gameScene.addSprite(pc);

//event listener do teclado
addEventListener("keydown", e => {
  switch (e.key) {
    case " ":
      keys.space = 1;
      break;
    case "ArrowLeft":
      keys.arrowLeft = 1;
      // this.lado = 0;
      break;
    case "ArrowUp":
      keys.arrowUp = 1;
      break;
    case "ArrowRight":
      keys.arrowRight = 1;
      // this.lado = 1;
      break;
    case "ArrowDown":
      keys.arrowDown = 1;
      break;
  }
});

addEventListener("keyup", e => {
  switch (e.key) {
    case " ":
      keys.space = 0;
      break;
    case "ArrowLeft":
      keys.arrowLeft = 0;
      break;
    case "ArrowUp":
      keys.arrowUp = 0;
      break;
    case "ArrowRight":
      keys.arrowRight = 0;
      break;
    case "ArrowDown":
      keys.arrowDown = 0;
      break;
  }
});

const render = t => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.save();
  dt = (t - previousTime) / 1000;
  if (assetsMng.progress() >= 100) {
    gameScene.step(dt);
  }
  previousTime = t;
  requestAnimationFrame(render);
  // ctx.restore();
};

let previousTime = 0;
let dt;
requestAnimationFrame(render);
