import { Container } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { IconButton } from "./Button";

export class ControlsBarView extends Container {
  buttonFullscreen!: IconButton;
  buttonPause!: IconButton;
  buttonSoundOn!: IconButton;
  buttonSoundOff!: IconButton;
  initialWidth = -1;
  initialHeight = -1;

  options = {
    gap: 10,
  };

  constructor() {
    super();

    this.setup();
  }

  setup() {
    this.buttonFullscreen = new IconButton({
      width: 80,
      textureNames: {
        active: "btn_fullscreen_active.png",
        hover: "btn_fullscreen_hover.png",
        press: "btn_fullscreen_press.png",
      },
    });

    this.buttonPause = new IconButton({
      width: 80,
      textureNames: {
        active: "btn_pause_active.png",
        hover: "btn_pause_hover.png",
        press: "btn_pause_press.png",
      },
    });

    this.buttonSoundOff = new IconButton({
      width: 80,
      textureNames: {
        active: "btn_sound_0_active.png",
        hover: "btn_sound_0_hover.png",
        press: "btn_sound_0_press.png",
      },
    });
    this.buttonSoundOff.on("pointerdown", () => {
      this.buttonSoundOn.visible = true;
      this.buttonSoundOff.visible = false;
    });

    this.buttonSoundOn = new IconButton({
      pressed: true,
      width: 80,
      textureNames: {
        active: "btn_sound_1_active.png",
        hover: "btn_sound_1_hover.png",
        press: "btn_sound_1_press.png",
      },
    });
    this.buttonSoundOn.on("pointerdown", () => {
      this.buttonSoundOn.visible = false;
      this.buttonSoundOff.visible = true;
    });
    this.buttonSoundOn.visible = false;

    this.addChild(this.buttonFullscreen);
    this.addChild(this.buttonSoundOff);
    this.addChild(this.buttonSoundOn);
    this.addChild(this.buttonPause);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleResize(_: ISceneResizeParams) {
    const { gap } = this.options;

    this.buttonFullscreen.position.x = 0;
    this.buttonFullscreen.position.y = gap;

    this.buttonSoundOff.position.x = this.buttonSoundOn.position.x =
      this.buttonFullscreen.position.x + this.buttonFullscreen.width + gap;
    this.buttonSoundOff.position.y = this.buttonSoundOn.position.y = gap;

    this.buttonPause.position.x = this.buttonSoundOff.position.x + this.buttonSoundOff.width + gap;
    this.buttonPause.position.y = gap;

    // console.log("viewWidth", viewWidth, "this.width", this.width, "gap", gap, "=", viewWidth - this.width - gap);

    if (this.initialWidth === -1) {
      this.initialWidth = this.width;
    }
    if (this.initialHeight === -1) {
      this.initialHeight = this.height;
    }
  }
}
