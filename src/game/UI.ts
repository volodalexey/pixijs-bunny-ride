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
  audio: UIOptions["audio"];
  #statusBar!: StatusBar;
  controlsBar!: ControlsBar;
  introModal!: IntroModal;
  leadboardModal!: LeadboardModal;

  options = {
    gap: 10,
  };

  constructor(options: UIOptions) {
    super();
    this.audio = options.audio;
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
    introModal.loginButton.on("pointerdown", this.playClickBtn);
    introModal.playButton.on("pointerdown", this.playClickBtn);

    const leadboardModal = new LeadboardModal({ audio, visible: false });
    this.addChild(leadboardModal);
    this.leadboardModal = leadboardModal;
    leadboardModal.okButton.on("pointerdown", this.switchToInto);
    leadboardModal.prevButton.on("pointerdown", this.playClickBtn);
    leadboardModal.nextButton.on("pointerdown", this.playClickBtn);
  }

  setCollectedCoinsCount(count: number) {
    this.#statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.#statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
    this.introModal.handleResize(options);
    this.leadboardModal.handleResize(options);

    const totalWidth =
      this.#statusBar.view.options.gap +
      this.#statusBar.view.initialWidth +
      this.controlsBar.view.options.gap * 2 +
      this.controlsBar.view.initialWidth;
    const statusBarFraction = this.#statusBar.view.initialWidth / totalWidth;
    const controlsBarFraction = this.controlsBar.view.initialWidth / totalWidth;
    Resize.handleResize({
      view: this.#statusBar.view,
      availableWidth: statusBarFraction * options.viewWidth,
      availableHeight: options.viewHeight,
      lockX: true,
      lockY: true,
      contentWidth: this.#statusBar.view.initialWidth,
      contentHeight: this.#statusBar.view.initialHeight,
      logName: "statusBar",
    });
    Resize.handleResize({
      view: this.controlsBar.view,
      availableWidth: controlsBarFraction * options.viewWidth,
      availableHeight: options.viewHeight,
      lockX: true,
      lockY: true,
      contentWidth: this.controlsBar.view.initialWidth,
      contentHeight: this.controlsBar.view.initialHeight,
      logName: "controlsBar",
    });
    this.controlsBar.view.position.x =
      options.viewWidth - this.controlsBar.view.width - this.controlsBar.view.options.gap;
  }

  hideIntro() {
    this.introModal.visible = false;
  }

  switchToLeaderboard = () => {
    this.hideIntro();
    this.leadboardModal.visible = true;
    this.leadboardModal.loadTimeSpanData();
    this.playClickBtn();
  };

  switchToInto = () => {
    this.introModal.visible = true;
    this.leadboardModal.visible = false;
    this.playClickBtn();
  };

  playClickBtn = () => {
    this.audio.playClick();
  };

  handleUpdate() {}
}
