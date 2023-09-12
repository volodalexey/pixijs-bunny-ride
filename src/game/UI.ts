import { Container } from "pixi.js";
import { StatusBar } from "./StatusBar";
import { ISceneResizeParams } from "../scenes/IScene";
import { ControlsBar } from "./ControlsBar";
// import { SuccessModal } from "./SuccessModal";

export class UI {
  #statusBar!: StatusBar;
  #controlsBar!: ControlsBar;
  //   #successModal!: SuccessModal;
  #aspectRatio = 9 / 16;
  #view = new Container();

  static options = {
    gap: 10,
  };

  constructor() {
    this.setup();
  }

  get view() {
    return this.#view;
  }

  setup() {
    const statusBar = new StatusBar();
    this.#view.addChild(statusBar.view);
    this.#statusBar = statusBar;

    const controlsBar = new ControlsBar();
    this.#view.addChild(controlsBar.view);
    this.#controlsBar = controlsBar;

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
    this.#controlsBar.handleResize(options);
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
