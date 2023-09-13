import { Game } from "../game/Game";
import { SceneManager } from "./SceneManager";
import { GameSceneView } from "./GameSceneView";
import { IScene, ISceneResizeParams } from "./IScene";

export class GameScene implements IScene {
  name = "game";
  game!: Game;
  #view;

  constructor() {
    this.#view = new GameSceneView();
    this.setup();
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.game = new Game({
      pixiApp: SceneManager.app,
      view: this.#view,
    });
  }

  handleResize(options: ISceneResizeParams) {
    this.game.handleResize(options);
  }

  handleUpdate(deltaMS: number) {
    this.game.handleUpdate(deltaMS);
  }

  mountedHandler() {}
}
