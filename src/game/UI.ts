import { Container } from "pixi.js";
import { StatusBar } from "./StatusBar";
import { ISceneResizeParams } from "../scenes/IScene";
import { ControlsBar } from "./ControlsBar";
import { GameAudio } from "../utils/Audio";
import { IntroModal } from "./IntroModal";
import { Resize } from "../utils/Resize";
import { LeadboardModal } from "./LeadboardModal";
import { EndgameModal } from "./EndgameModal";
import { Game } from "./Game";

export interface UIOptions {
  game: Game;
  audio: GameAudio;
}

export class UI extends Container {
  game: UIOptions["game"];
  audio: UIOptions["audio"];
  statusBar!: StatusBar;
  controlsBar!: ControlsBar;
  introModal!: IntroModal;
  leadboardModal!: LeadboardModal;
  endgameModal!: EndgameModal;

  options = {
    gap: 10,
  };

  constructor(options: UIOptions) {
    super();
    this.game = options.game;
    this.audio = options.audio;
    this.setup(options);
  }

  setup({ audio }: UIOptions) {
    const statusBar = new StatusBar();
    this.addChild(statusBar.view);
    this.statusBar = statusBar;

    const controlsBar = new ControlsBar({
      audio,
    });
    this.addChild(controlsBar.view);
    this.controlsBar = controlsBar;

    const introModal = new IntroModal({ game: this.game });
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

    const endgameModal = new EndgameModal({ visible: false });
    this.addChild(endgameModal);
    this.endgameModal = endgameModal;
    endgameModal.okButton.on("pointerdown", this.switchToInto);
  }

  setCollectedCoinsCount(count: number) {
    this.statusBar.setCollectedCoinsCount(count);
  }

  handleResize(options: ISceneResizeParams) {
    this.statusBar.handleResize(options);
    this.controlsBar.handleResize(options);
    this.introModal.handleResize(options);
    this.leadboardModal.handleResize(options);
    this.endgameModal.handleResize(options);

    const totalWidth =
      this.statusBar.view.options.gap +
      this.statusBar.view.initialWidth +
      this.controlsBar.view.options.gap * 2 +
      this.controlsBar.view.initialWidth;
    const statusBarFraction = this.statusBar.view.initialWidth / totalWidth;
    const controlsBarFraction = this.controlsBar.view.initialWidth / totalWidth;
    Resize.handleResize({
      view: this.statusBar.view,
      availableWidth: statusBarFraction * options.viewWidth,
      availableHeight: options.viewHeight,
      lockX: true,
      lockY: true,
      contentWidth: this.statusBar.view.initialWidth,
      contentHeight: this.statusBar.view.initialHeight,
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

  switchToLeaderboard = () => {
    this.introModal.hideModal();
    this.endgameModal.hideModal();

    this.leadboardModal.showModal();
    this.leadboardModal.loadTimeSpanData();
    this.playClickBtn();
  };

  switchToInto = () => {
    this.leadboardModal.hideModal();
    this.endgameModal.hideModal();

    this.introModal.showModal();
    this.playClickBtn();
  };

  switchToEndgame = (success: boolean) => {
    this.audio.playGameEnd();
    this.introModal.hideModal();
    this.leadboardModal.hideModal();

    this.endgameModal.assignData(
      success,
      this.game.getScore(),
      this.game.coinsCollected,
      this.game.getDistanceTravelled(),
    );
    this.endgameModal.showModal();
    this.playClickBtn();
  };

  restart() {
    this.introModal.hideModal();
    this.leadboardModal.hideModal();
    this.endgameModal.hideModal();
    this.statusBar.view.coinsCollectedText.text = "0";
    this.controlsBar.view.buttonPause.externalPressed = false;
    this.controlsBar.view.buttonPause.updateState();
  }

  playClickBtn = () => {
    this.audio.playClick();
  };

  handleUpdate(deltaMS: number) {
    this.endgameModal.handleUpdate(deltaMS);
  }
}
