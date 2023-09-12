import { Container } from "pixi.js";
import { StatusBar } from "./StatusBar";
import { ISceneResizeParams, PixiApp } from "../scenes/IScene";
import { ControlsBar } from "./ControlsBar";
import { GameAudio } from "../utils/Audio";
import { IntroModal } from "./IntroModal";
import { Resize } from "../utils/Resize";
import { LeadboardModal } from "./LeadboardModal";

export interface UIOptions {
  pixiApp: PixiApp;
  audio: GameAudio;
}

export class UI extends Container {
  #statusBar!: StatusBar;
  controlsBar!: ControlsBar;
  introModal!: IntroModal;
  leadboardModal!: LeadboardModal;
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

    const introModal = new IntroModal({});
    this.addChild(introModal);
    this.introModal = introModal;
    introModal.leadboardButton.on("pointerdown", this.switchToLeaderboard);

    const leadboardModal = new LeadboardModal({ visible: false });
    this.addChild(leadboardModal);
    this.leadboardModal = leadboardModal;
    leadboardModal.okButton.on("pointerdown", this.switchToInto);
  }

  setCollectedCoinsCount(count: number) {
    this.#statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.#statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
    this.introModal.handleResize(options);
    this.leadboardModal.handleResize(options);
    Resize.handleResize({
      view: this.introModal,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      lockWidth: true,
      lockHeight: true,
    });
    Resize.handleResize({
      view: this.leadboardModal,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      lockWidth: true,
      lockHeight: true,
    });
  }

  hideIntro() {
    this.introModal.visible = false;
  }

  switchToLeaderboard = () => {
    this.hideIntro();
    this.leadboardModal.visible = true;
  };

  switchToInto = () => {
    this.introModal.visible = true;
    this.leadboardModal.visible = false;
  };

  handleUpdate() {}
}
