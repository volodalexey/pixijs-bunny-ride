import { ISceneResizeParams } from "../scenes/IScene";
import { ControlsBarView } from "./ControlsBarView";

export class ControlsBar {
  #view!: ControlsBarView;

  constructor() {
    this.setup();
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new ControlsBarView();
  }

  handleResize(options: ISceneResizeParams) {
    this.#view.handleResize(options);
  }
}
