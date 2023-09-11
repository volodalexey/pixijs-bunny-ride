import { DisplayObject } from "pixi.js";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";

export interface IGameOptions {
  pixiApp: PixiApp;
  view: DisplayObject;
}

export class Game {
  #pixiApp!: PixiApp;
  #view;
  // #ui
  #isEndGame = false;

  constructor({ pixiApp, view }: IGameOptions) {
    this.#pixiApp = pixiApp;
    this.#view = view;
    // this.#ui = new UI({
    //   onSuccessResult: this.handleSuccessResult,
    //   onErrorResult: this.handleErrorResult,
    //   onNextLevel: this.handleNextLevel
    // });
    // this.#view.addChild(this.#ui.view);
  }

  handleResize(options: ISceneResizeParams) {
    console.log(options);
    // this.#ui.handleResize(options);
  }

  handleUpdate() {
    this.#checkGameStatus();
    // this.#ui.handleUpdate();
  }

  #checkGameStatus() {
    if (this.#isEndGame) {
      return;
    }
  }
}
