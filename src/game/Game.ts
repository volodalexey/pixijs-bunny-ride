import { Container } from "pixi.js";
import { UI } from "./UI";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";

export interface IGameOptions {
  pixiApp: PixiApp;
  view: Container;
}

export class Game {
  #pixiApp!: PixiApp;
  #view!: Container;
  #ui!: UI;
  #isEndGame = false;

  constructor({ pixiApp, view }: IGameOptions) {
    this.#pixiApp = pixiApp;
    this.#view = view;
    this.#ui = new UI();
    this.#view.addChild(this.#ui.view);
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
}
