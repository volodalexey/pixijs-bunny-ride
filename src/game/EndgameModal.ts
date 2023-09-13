import { Text, TextStyle } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";
import { COLOR_BLUE, COLOR_GREEN, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";
import { IconButton } from "./Button";
import { Resize } from "../utils/Resize";

export interface EndgameModalOptions extends Omit<ModalOptions, "title"> {
  visible?: boolean;
}

export class EndgameModal extends Modal {
  scoreText!: Text;
  coinsText!: Text;
  distanceText!: Text;
  okButton!: IconButton;
  initialWidth = -1;
  initialHeight = -1;

  endgameOptions = {
    scoreGap: 10,
    coinsTopGap: 40,
    coinsLeftGap: 40,
    disatanceTopGap: 40,
    distanceLeftGap: 40,
    okButtonGap: 20,
    score: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL * 1.1,
      fill: COLOR_GREEN,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
      letterSpacing: 5,
    },
    coins: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL * 1.1,
      fill: COLOR_GREEN,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
      letterSpacing: 5,
    },
    distance: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL * 1.1,
      fill: COLOR_GREEN,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
      letterSpacing: 5,
    },
  };

  constructor(options: EndgameModalOptions) {
    super({ ...options, width: 500, title: "" });

    this.setupContent();
  }

  setupContent() {
    const scoreText = new Text("s", {
      ...this.endgameOptions.score,
    });
    scoreText.anchor.x = 0.5;
    this.addChild(scoreText);
    this.scoreText = scoreText;

    const coinsText = new Text("c", {
      ...this.endgameOptions.coins,
    });
    coinsText.anchor.x = 0.5;
    this.addChild(coinsText);
    this.coinsText = coinsText;

    const distanceText = new Text("d", {
      ...this.endgameOptions.distance,
    });
    distanceText.anchor.x = 0.5;
    this.addChild(distanceText);
    this.distanceText = distanceText;

    this.okButton = new IconButton({
      textureNames: {
        active: "ok_button_active.png",
        hover: "ok_button_hover.png",
        press: "ok_button_press.png",
      },
    });
    this.addChild(this.okButton);
  }

  handleResize(options: ISceneResizeParams) {
    super.handleResize(options);

    const middleX = this.sprites.infoPlate.width / 2;

    this.scoreText.position.x = middleX;
    this.scoreText.position.y =
      this.sprites.headerInfoPlate.y + this.sprites.headerInfoPlate.height + this.endgameOptions.scoreGap;

    this.coinsText.position.x = middleX;
    this.coinsText.position.y = this.scoreText.position.y + this.scoreText.height + this.endgameOptions.coinsTopGap;

    this.distanceText.position.x = middleX;
    this.distanceText.position.y =
      this.coinsText.position.y + this.coinsText.height + this.endgameOptions.disatanceTopGap;

    this.okButton.position.x = middleX - this.okButton.width / 2;
    this.okButton.position.y = this.sprites.infoPlate.height - this.okButton.height - this.endgameOptions.okButtonGap;

    if (this.initialWidth === -1) {
      this.initialWidth = this.width;
    }
    if (this.initialHeight === -1) {
      this.initialHeight = this.height;
    }
    Resize.handleResize({
      view: this,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      contentWidth: this.initialWidth,
      contentHeight: this.initialHeight,
    });
  }
}
