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

  options = {
    gap: 10,
    statusBarWidth: 0,
    statusBarHeight: 0,
    controlsBarWidth: 0,
    controlsBarHeight: 0,
    introModalWidth: 500,
    introModalHeight: 0,
    leadboardModalWidth: 500,
    leadboardModalHeight: 0,
  };

  constructor(options: UIOptions) {
    super();
    this.setup(options);
  }

  setup({ audio }: UIOptions) {
    const statusBar = new StatusBar();
    this.addChild(statusBar.view);
    this.#statusBar = statusBar;
    this.options.statusBarWidth = statusBar.view.width;
    this.options.statusBarHeight = statusBar.view.height;

    const controlsBar = new ControlsBar({
      audio,
    });
    this.addChild(controlsBar.view);
    this.controlsBar = controlsBar;
    this.options.controlsBarWidth = controlsBar.view.width;
    this.options.controlsBarHeight = controlsBar.view.height;

    const introModal = new IntroModal({ width: this.options.introModalWidth });
    this.addChild(introModal);
    this.introModal = introModal;
    introModal.leadboardButton.on("pointerdown", this.switchToLeaderboard);
    this.options.introModalHeight = introModal.height;

    const leadboardModal = new LeadboardModal({ width: this.options.leadboardModalWidth, visible: false });
    this.addChild(leadboardModal);
    this.leadboardModal = leadboardModal;
    leadboardModal.okButton.on("pointerdown", this.switchToInto);
    this.options.leadboardModalHeight = leadboardModal.height;
  }

  setCollectedCoinsCount(count: number) {
    this.#statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.#statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
    this.introModal.handleResize(options);
    this.leadboardModal.handleResize(options);
    // Resize.handleResize({
    //   view: this.#statusBar.view,
    //   availableWidth: options.viewWidth,
    //   availableHeight: options.viewHeight,
    //   lockX: true,
    //   lockY: true,
    //   contentWidth: this.options.statusBarWidth + this.options.controlsBarWidth,
    //   contentHeight: this.options.statusBarHeight,
    // });
    Resize.handleResize({
      view: this.introModal,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      contentWidth: this.options.introModalWidth,
      contentHeight: this.options.introModalHeight,
    });
    Resize.handleResize({
      view: this.leadboardModal,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      contentWidth: this.options.leadboardModalWidth,
      contentHeight: this.options.leadboardModalHeight,
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
