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
  username = "Test username";

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
      this.distanceTravelled += deltaMS * 0.01;
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
      this.distanceTravelled = 0;
      this.coinsCollected = 0;
      this.#ended = false;
      this.#paused = false;
      this.#ui.restart();
      this.hero.restart();
      this.background.restart();
      this.#audio.playMusic();
    }
  };

  endGame(success: boolean) {
    this.#ended = true;
    this.#ui.switchToEndgame(success);
  }

  endGameWithCheck() {
    const lastScore = this.loadScore();
    const score = this.getScore();
    const success = score > lastScore;
    if (success) {
      this.saveScore();
    }
    this.endGame(success);
  }

  getDistanceTravelled() {
    return Math.round(this.distanceTravelled);
  }

  loadScore() {
    return Number(localStorage.getItem(this.username)) ?? 0;
  }

  saveScore() {
    localStorage.setItem(this.username, String(this.getScore()));
  }

  getScore() {
    return this.coinsCollected * 2 + this.getDistanceTravelled();
  }

  getLevelBottom(height: number): number {
    return SceneManager.height - height - this.options.groundMargin;
  }

  getLevelRight(width: number): number {
    return SceneManager.width - width;
  }

  collectCoin() {
    this.coinsCollected++;
    this.#ui.statusBar.view.coinsCollectedText.text = this.coinsCollected;
  }
}
