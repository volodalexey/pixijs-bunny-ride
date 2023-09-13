import { Container } from "pixi.js";
import { UI } from "./UI";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";
import { GameAudio } from "../utils/Audio";

export interface IGameOptions {
  pixiApp: PixiApp;
  view: Container;
}

export class Game {
  #pixiApp!: PixiApp;
  #audio!: GameAudio;
  #view!: Container;
  #ui!: UI;
  #isEndGame = false;
  #paused = false;
  coinsCollected = 0;
  distanceTravelled = 0;

  constructor({ pixiApp, view }: IGameOptions) {
    this.#pixiApp = pixiApp;
    this.#audio = new GameAudio();
    this.#view = view;
    this.#ui = new UI({ game: this, audio: this.#audio });
    this.#view.addChild(this.#ui);

    this.#ui.controlsBar.view.buttonPause.on("pointerdown", this.handlePause);
    this.#ui.introModal.playButton.on("pointerdown", this.handleStart);

    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "Escape":
          this.endGame(false);
          break;
        case "Enter":
          this.endGame(true);
          break;
        case "Space":
          this.handleStart();
          break;
      }
    });
  }

  handleResize(options: ISceneResizeParams) {
    this.#ui.handleResize(options);
  }

  handleUpdate(deltaMS: number) {
    this.#checkGameStatus();
    this.#ui.handleUpdate(deltaMS);
  }

  #checkGameStatus() {
    if (this.#isEndGame) {
      return;
    }
  }

  handlePause = () => {
    this.#paused = !this.#paused;
    this.#ui.controlsBar.view.buttonPause.externalPressed = this.#paused;
  };

  handleStart = () => {
    this.#isEndGame = false;
    this.#paused = false;
    this.#ui.hideAllModals();
  };

  endGame(success: boolean) {
    this.#isEndGame = true;
    this.#ui.switchToEndgame(success);
  }

  getScore() {
    return this.coinsCollected * 2 + this.distanceTravelled;
  }
}
