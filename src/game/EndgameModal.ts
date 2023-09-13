import { Assets, Container, Sprite, Spritesheet, Text, TextStyle } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";
import {
  COLOR_BLUE,
  COLOR_GREEN,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_ORANGE,
  FONT_FAMILY,
  FONT_SIZE_XXXL,
  FONT_SIZE_XXXXL,
} from "../utils/constants";
import { IconButton } from "./Button";
import { Resize } from "../utils/Resize";
import { Rays } from "./Rays";
import { Star, Stars } from "./Star";

export interface EndgameModalOptions extends Omit<ModalOptions, "title"> {
  visible?: boolean;
}

export class EndgameModal extends Modal {
  successDecoration!: Container;
  rays!: Rays;
  stars!: Stars;
  scoreText!: Text;
  coinsLine!: Container;
  coinsIcon!: Sprite;
  coinsText!: Text;
  distanceLine!: Container;
  distanceIcon!: Sprite;
  distanceText!: Text;
  okButton!: IconButton;
  initialWidth = -1;
  initialHeight = -1;
  success = false;

  endgameOptions = {
    scoreGap: 10,
    coinsTopGap: 40,
    coinsLeftGap: 90,
    coinsTextTopGap: 38,
    coinsTextLeftGap: 300,
    disatanceTopGap: 40,
    distanceLeftGap: 70,
    distanceTextTopGap: 60,
    distanceTextLeftGap: 330,
    okButtonGap: 20,
    starsSideGap: 100,
    starsCount: 4,
    score: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXXXL,
      fill: COLOR_GREEN,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
    },
    coins: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXXL,
      fill: COLOR_LIGHT_ORANGE,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
    },
    distance: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXXL,
      fill: COLOR_LIGHT_BLUE,
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
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    const successDecoration = new Container();

    const rays = new Rays();
    rays.position.set(this.sprites.infoPlate.width / 2, this.sprites.infoPlate.height / 2);
    successDecoration.addChild(rays);
    this.rays = rays;

    const stars = new Stars();
    successDecoration.addChild(stars);
    this.stars = stars;

    Array(this.endgameOptions.starsCount)
      .fill(false)
      .forEach((_, idx, all) => {
        const starLeft = new Star();
        const starRight = new Star();
        const relation = idx / (all.length - 1);
        starLeft.position.y = starRight.position.y = this.sprites.infoPlate.height * relation;
        starLeft.position.x =
          -this.endgameOptions.starsSideGap - this.endgameOptions.starsSideGap * (1 - Math.abs(relation - 0.5) * 2);
        starRight.position.x =
          this.sprites.infoPlate.width +
          +this.endgameOptions.starsSideGap +
          this.endgameOptions.starsSideGap * (1 - Math.abs(relation - 0.5) * 2);
        stars.addChild(starLeft);
        stars.addChild(starRight);
      });

    this.addChildAt(successDecoration, 0);
    this.successDecoration = successDecoration;

    const scoreText = new Text("s", {
      ...this.endgameOptions.score,
    });
    scoreText.anchor.x = 0.5;
    this.addChild(scoreText);
    this.scoreText = scoreText;

    const coinsLine = new Container();
    this.coinsLine = coinsLine;

    const coinsIcon = new Sprite(textures["collect_coin_icon.png"]);
    coinsLine.addChild(coinsIcon);
    this.coinsIcon = coinsIcon;

    const coinsText = new Text("c", {
      ...this.endgameOptions.coins,
    });
    coinsText.anchor.x = 0.5;
    coinsText.anchor.y = 0.5;
    coinsText.position.x = this.endgameOptions.coinsTextLeftGap;
    coinsText.position.y = this.endgameOptions.coinsTextTopGap;
    this.coinsText = coinsText;
    coinsLine.addChild(coinsText);

    this.addChild(coinsLine);

    const distanceLine = new Container();
    this.distanceLine = distanceLine;

    const distanceIcon = new Sprite(textures["collect_distance_icon.png"]);
    distanceLine.addChild(distanceIcon);
    this.distanceIcon = distanceIcon;

    const distanceText = new Text("d", {
      ...this.endgameOptions.distance,
    });
    distanceText.anchor.x = 0.5;
    distanceText.anchor.y = 0.5;
    distanceText.position.x = this.endgameOptions.distanceTextLeftGap;
    distanceText.position.y = this.endgameOptions.distanceTextTopGap;
    distanceLine.addChild(distanceText);
    this.distanceText = distanceText;

    this.addChild(distanceLine);

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

    this.coinsLine.position.x = this.endgameOptions.coinsLeftGap;
    this.coinsLine.position.y = this.scoreText.position.y + this.scoreText.height + this.endgameOptions.coinsTopGap;

    this.distanceLine.position.x = this.endgameOptions.distanceLeftGap;
    this.distanceLine.position.y =
      this.coinsLine.position.y + this.coinsLine.height + this.endgameOptions.disatanceTopGap;

    this.okButton.position.x = middleX - this.okButton.width / 2;
    this.okButton.position.y = this.sprites.infoPlate.height - this.okButton.height - this.endgameOptions.okButtonGap;

    const initialVisible = this.successDecoration.visible;
    this.successDecoration.visible = false;
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
    this.successDecoration.visible = initialVisible;
  }

  assignData(success: boolean, score: number, coins: number, distance: number): void {
    this.success = success;
    this.successDecoration.visible = success;
    this.headerText.text = success ? "Новый рекорд:" : "Твои очки:";
    this.scoreText.text = `${score}`;
    this.coinsText.text = `${coins}`;
    this.distanceText.text = `${distance} м`;
  }

  handleUpdate(deltaMS: number) {
    if (this.visible && this.success) {
      this.rays.handleUpdate(deltaMS);
      this.stars.handleUpdate(deltaMS);
    }
  }
}
