import { AssetsManager } from "./AssetsManager.js";
import { Player } from "../sprites/Player.js";
import { Scene } from "./Scene.js";
import { Sprite } from "./Sprite.js";
import { niveis } from "../mapas/niveis.js";

//assets gerais: sprites, musicas, etc
var assetsMng = new AssetsManager();
assetsMng.loadImage("bear", "./assets/bear.png");
assetsMng.loadImage("charger", "./assets/charger.png");

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
    if (keys.arrowUp && this.pulo <= 0) {
      this.pulo = 1.0;
      this.vy = -500;
    }
    if (keys.arrowUp === keys.arrowDown) {
      this.ay = 0;
    }
  };
};

var pc = new Player({
  x: 120,
  y: 540,
  width: 24,
  height: 24,
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
  map: niveis,
  scenePlayer: pc,
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
      break;
    case "ArrowUp":
      keys.arrowUp = 1;
      break;
    case "ArrowRight":
      keys.arrowRight = 1;
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
  ctx.save();
  ctx.scale(2,2);
  ctx.translate(canvas.width/4-pc.x,canvas.height/4-pc.y)

  dt = (t - previousTime) / 1000;
  if (assetsMng.progress() >= 100) {
    gameScene.step(dt);
  }
  previousTime = t;
  requestAnimationFrame(render);
  ctx.restore();
};

let previousTime = 0;
let dt;
requestAnimationFrame(render);
