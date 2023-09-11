import { ISceneResizeParams } from "../scenes/IScene";
import { SceneManager } from "../scenes/SceneManager";
import { StatusBarView } from "./StatusBarView";

export class StatusBar {
  #view!: StatusBarView;

  constructor() {
    this.setup();
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new StatusBarView();
  }

  setCollectedCoinsCount(count: number) {
    this.#view.coinsCollectedText.text = `${count}`;
    this.handleResize(SceneManager.intoResizeParams());
  }

  handleResize(options: ISceneResizeParams) {
    this.#view.handleResize(options);
  }
}
