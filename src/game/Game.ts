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

  constructor({ pixiApp, view }: IGameOptions) {
    this.#pixiApp = pixiApp;
    this.#audio = new GameAudio();
    this.#view = view;
    this.#ui = new UI({ pixiApp, audio: this.#audio });
    this.#view.addChild(this.#ui);

    this.#ui.controlsBar.view.buttonPause.on("pointerdown", this.handlePause);
    this.#ui.introModal.playButton.on("pointerdown", this.handleStart);
  }

  handleResize(options: ISceneResizeParams) {
    this.#ui.handleResize(options);
  }

  handleUpdate() {
    this.#checkGameStatus();
    this.#ui.handleUpdate();
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
    this.#ui.hideIntro();
  };
}
