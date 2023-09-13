import { Assets, Container, Sprite, Spritesheet, Text, TextStyle } from "pixi.js";
import {
  COLOR_1_PLACE,
  COLOR_2_PLACE,
  COLOR_3_PLACE,
  COLOR_DARK_GRAY,
  COLOR_WHITE,
  FONT_FAMILY,
  FONT_SIZE_REGULAR,
  FONT_SIZE_XL,
  FONT_SIZE_XXL,
} from "../utils/constants";

export interface TextInputOptions {
  text: string;
  textureName: string;
  fontSize?: TextStyle["fontSize"];
  fontColor?: TextStyle["fill"];
  align?: TextStyle["_align"];
  gapTop?: number;
  gapLeft?: number;
}

export class TextInputPlate extends Container {
  backgroundSprite!: Sprite;
  inputText!: Text;

  options = {
    text: <Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "align">>{
      align: "left",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL,
      fill: COLOR_WHITE,
    },
  };

  constructor(options: TextInputOptions) {
    super();

    this.setup(options);
  }

  setup({ textureName, text, align, fontSize, fontColor, gapLeft = 20, gapTop = 20 }: TextInputOptions) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    this.backgroundSprite = new Sprite(textures[textureName]);
    this.addChild(this.backgroundSprite);

    const inputText = new Text(text, {
      ...this.options.text,
      fontSize: fontSize ?? this.options.text.fontSize,
      fill: fontColor ?? this.options.text.fill,
      align: align ?? this.options.text.align,
    });
    inputText.position.x = gapLeft;
    if (align != null && align === "center") {
      inputText.anchor.x = 0.5;
      inputText.position.x = this.backgroundSprite.width / 2;
    }
    inputText.position.y = gapTop;
    this.addChild(inputText);
    this.inputText = inputText;
  }
}

export class UserNamePlate extends TextInputPlate {
  constructor() {
    super({
      textureName: "user_name_bar.png",
      text: "Test username",
      gapLeft: 40,
      gapTop: 20,
    });
  }
}

interface HighleaderNamePlateOptions extends Omit<TextInputOptions, "fontSize" | "gapTop" | "gapLeft"> {}

class HighleaderNamePlate extends TextInputPlate {
  constructor(options: HighleaderNamePlateOptions) {
    super({
      fontSize: FONT_SIZE_XL,
      gapTop: 20,
      gapLeft: 90,
      ...options,
    });
  }
}

export class HighleaderName1Plate extends HighleaderNamePlate {
  constructor(options: Omit<HighleaderNamePlateOptions, "textureName" | "fontColor">) {
    super({
      textureName: "place_1.png",
      fontColor: COLOR_1_PLACE,
      ...options,
    });
  }
}

export class HighleaderName2Plate extends HighleaderNamePlate {
  constructor(options: Omit<HighleaderNamePlateOptions, "textureName" | "fontColor">) {
    super({
      textureName: "place_2.png",
      fontColor: COLOR_2_PLACE,
      ...options,
    });
  }
}

export class HighleaderName3Plate extends HighleaderNamePlate {
  constructor(options: Omit<HighleaderNamePlateOptions, "textureName" | "fontColor">) {
    super({
      textureName: "place_3.png",
      fontColor: COLOR_3_PLACE,
      ...options,
    });
  }
}

interface HighleaderScoresPlateOptions
  extends Omit<TextInputOptions, "textureName" | "fontSize" | "gapTop" | "gapLeft" | "align"> {}

class HighleaderScoresPlate extends TextInputPlate {
  constructor(options: HighleaderScoresPlateOptions) {
    super({
      textureName: "highleader_scores_plate.png",
      fontSize: FONT_SIZE_XL,
      align: "center",
      gapLeft: 20,
      gapTop: 5,
      ...options,
    });
  }
}

export class HighleaderScores1Plate extends HighleaderScoresPlate {
  constructor(options: Omit<HighleaderScoresPlateOptions, "fontColor">) {
    super({
      fontColor: COLOR_1_PLACE,
      ...options,
    });
  }
}

export class HighleaderScores2Plate extends HighleaderScoresPlate {
  constructor(options: Omit<HighleaderScoresPlateOptions, "fontColor">) {
    super({
      fontColor: COLOR_2_PLACE,
      ...options,
    });
  }
}

export class HighleaderScores3Plate extends HighleaderScoresPlate {
  constructor(options: Omit<HighleaderScoresPlateOptions, "fontColor">) {
    super({
      fontColor: COLOR_3_PLACE,
      ...options,
    });
  }
}

export class MidleaderNamePlate extends TextInputPlate {
  constructor(options: Omit<TextInputOptions, "textureName" | "fontSize" | "fontColor" | "gapLeft" | "gapTop">) {
    super({
      textureName: "midleader_name_plate.png",
      fontSize: FONT_SIZE_REGULAR,
      fontColor: COLOR_DARK_GRAY,
      gapLeft: 20,
      gapTop: 0,
      ...options,
    });
  }
}

export class MidleaderScoresPlate extends TextInputPlate {
  constructor(
    options: Omit<TextInputOptions, "textureName" | "fontSize" | "fontColor" | "gapLeft" | "gapTop" | "align">,
  ) {
    super({
      textureName: "midleader_scores_plate.png",
      align: "center",
      fontSize: FONT_SIZE_REGULAR,
      fontColor: COLOR_DARK_GRAY,
      gapLeft: 20,
      gapTop: 0,
      ...options,
    });
  }
}
