import { ISceneResizeParams } from "../scenes/IScene";
import { GameAudio } from "../utils/Audio";
import { ControlsBarView } from "./ControlsBarView";

export interface ControlsBarOptions {
  audio: GameAudio;
}

export class ControlsBar {
  #view!: ControlsBarView;
  audio: ControlsBarOptions["audio"];

  constructor(options: ControlsBarOptions) {
    this.audio = options.audio;
    this.setup();
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new ControlsBarView();

    this.#view.buttonFullscreen.on("pointerdown", () => {
      if (!document.fullscreenElement) {
        const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
        if (canvas != null) {
          canvas.requestFullscreen().catch((err: Error) => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
          });
        }
      } else {
        document.exitFullscreen();
      }
      this.audio.playClick();
    });

    this.#view.buttonSoundOn.on("pointerdown", () => {
      this.audio.stopMusic();
      this.audio.muted = true;
    });

    this.#view.buttonSoundOff.on("pointerdown", () => {
      this.audio.muted = false;
      this.audio.playMusic();
      this.audio.playClick();
    });

    this.#view.buttonPause.on("pointerdown", () => {
      this.audio.playClick();
    });
  }

  handleResize(options: ISceneResizeParams) {
    this.#view.handleResize(options);
  }
}
