import { Container } from "pixi.js";
import { StatusBar } from "./StatusBar";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";
import { ControlsBar } from "./ControlsBar";
import { GameAudio } from "../utils/Audio";
// import { SuccessModal } from "./SuccessModal";

export interface UIOptions {
  pixiApp: PixiApp;
  audio: GameAudio;
}

export class UI extends Container {
  #statusBar!: StatusBar;
  controlsBar!: ControlsBar;
  //   #successModal!: SuccessModal;
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

    // const startModal = new SuccessModal({
    //   onClick: () => {
    //     this.onNextLevel();
    //   },
    // });
    // startModal.hideModal();
    // this.#view.addChild(startModal);
    // this.#successModal = startModal;
  }

  setCollectedCoinsCount(count: number) {
    this.#statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.#statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
  }

  handleUpdate() {}

  //   toggleSuccessModal(toggle) {
  //     if (toggle) {
  //       this.#successModal.showModal();
  //       this.#splitScreen.toggleDisabled(true);
  //     } else {
  //       this.#successModal.hideModal();
  //       this.#splitScreen.toggleDisabled(false);
  //     }
  //   }
}
