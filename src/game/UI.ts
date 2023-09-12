import { Container } from "pixi.js";
import { StatusBar } from "./StatusBar";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";
import { ControlsBar } from "./ControlsBar";
import { GameAudio } from "../utils/Audio";
import { IntroModal } from "./IntroModal";
import { Resize } from "../utils/Resize";

export interface UIOptions {
  pixiApp: PixiApp;
  audio: GameAudio;
}

export class UI extends Container {
  #statusBar!: StatusBar;
  controlsBar!: ControlsBar;
  #introModal!: IntroModal;
  #aspectRatio = 9 / 16;

  static options = {
    gap: 10,
  };

  constructor(options: UIOptions) {
    super();
    this.setup(options);
  }

  setup({ audio }: UIOptions) {
    const statusBar = new StatusBar();
    this.addChild(statusBar.view);
    this.#statusBar = statusBar;

    const controlsBar = new ControlsBar({
      audio,
    });
    this.addChild(controlsBar.view);
    this.controlsBar = controlsBar;

    const introModal = new IntroModal({
      title: "Твои рекорды:",
    });
    this.addChild(introModal);
    this.#introModal = introModal;
  }

  setCollectedCoinsCount(count: number) {
    this.#statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.#statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
    this.#introModal.handleResize(options);
    Resize.handleResize({
      view: this.#introModal,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      lockWidth: true,
      lockHeight: true,
    });
  }

  handleUpdate() {}
}
