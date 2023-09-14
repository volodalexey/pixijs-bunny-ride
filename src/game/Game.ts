import { Container } from "pixi.js";
import { UI } from "./UI";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";
import { GameAudio } from "../utils/Audio";
import { Background } from "./Background";
import { Hero } from "./Hero";
import { InputHandler } from "./InputHandler";
import { SceneManager } from "../scenes/SceneManager";

export interface IGameOptions {
  pixiApp: PixiApp;
  view: Container;
}

export class Game {
  speed = 0.5;
  #audio!: GameAudio;
  #view!: Container;
  #ui!: UI;
  #ended = true;
  #paused = false;
  coinsCollected = 0;
  distanceTravelled = 0;
  background!: Background;
  hero!: Hero;
  inputHandler!: InputHandler;
  options = {
    groundMargin: 82,
  };

  constructor({ view }: IGameOptions) {
    this.#audio = new GameAudio();
    this.#view = view;

    this.background = new Background({ game: this });
    this.#view.addChild(this.background);

    this.hero = new Hero({ game: this, audio: this.#audio });
    this.#view.addChild(this.hero);

    this.inputHandler = new InputHandler({ eventTarget: this.#view, relativeToTarget: this.hero });

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
    this.background.handleResize(options);
  }

  handleUpdate(deltaMS: number) {
    this.#checkGameStatus();
    this.#ui.handleUpdate(deltaMS);
    if (!this.#paused && !this.#ended) {
      this.background.handleUpdate(deltaMS);
      this.hero.handleUpdate(deltaMS);
    }
  }

  #checkGameStatus() {
    if (this.#ended) {
      return;
    }
  }

  handlePause = () => {
    this.#audio.stopSnow();
    this.#paused = !this.#paused;
    this.#ui.controlsBar.view.buttonPause.externalPressed = this.#paused;
  };

  handleStart = () => {
    if (this.#ended && this.#ui.introModal.visible) {
      this.#ended = false;
      this.#paused = false;
      this.#ui.hideAllModals();
    }
  };

  endGame(success: boolean) {
    this.#ended = true;
    this.#ui.switchToEndgame(success);
  }

  checkEndGame() {
    this.endGame(true);
  }

  getScore() {
    return this.coinsCollected * 2 + this.distanceTravelled;
  }

  getLevelBottom(height: number): number {
    return SceneManager.height - height - this.options.groundMargin;
  }

  getLevelRight(width: number): number {
    return SceneManager.width - width;
  }
}
