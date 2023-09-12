import { Assets, Container, Sprite, Spritesheet, Text, TextStyle } from "pixi.js";
import { COLOR_WHITE, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";
import { ISceneResizeParams } from "../scenes/IScene";

export interface TextInputOptions {
  text: string;
  textureName: string;
  fontSize?: TextStyle["fontSize"];
  fontColor?: TextStyle["fill"];
}

export class TextInput extends Container {
  backgroundSprite!: Sprite;
  inputText!: Text;

  options = {
    gapTop: 20,
    gapLeft: 40,
    text: <Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "align">>{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL,
      fill: COLOR_WHITE,
    },
  };

  constructor(options: TextInputOptions) {
    super();

    this.setup(options);
  }

  setup({ textureName, text, fontSize, fontColor }: TextInputOptions) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    this.backgroundSprite = new Sprite(textures[textureName]);
    this.addChild(this.backgroundSprite);

    const inputText = new Text(text, {
      ...this.options.text,
      fontSize: fontSize ?? this.options.text.fontSize,
      fill: fontColor ?? this.options.text.fill,
    });
    this.addChild(inputText);
    this.inputText = inputText;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleResize(options: ISceneResizeParams) {
    this.inputText.position.x = this.options.gapLeft;
    this.inputText.position.y = this.options.gapTop;
  }
}
