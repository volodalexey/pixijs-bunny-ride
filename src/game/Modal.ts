import { Container, type Texture, Spritesheet, Assets, Sprite, Text, TextStyle } from "pixi.js";
import { Scale } from "../utils/Scale";
import { ISceneResizeParams } from "../scenes/IScene";
import { COLOR_BLUE, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";

export interface ModalOptions {
  visible?: boolean;
  width?: number;
  height?: number;
  title: string;
}

type ModalTextures = { infoPlate: Texture; headerInfoPlate: Texture };
type ModalSprites = { infoPlate: Sprite; headerInfoPlate: Sprite };

export class Modal extends Container {
  static textures: ModalTextures;

  options = {
    headerInfo: {
      gap: 5,
    },
    header: <Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing">>{
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL,
      fill: COLOR_BLUE,
      stroke: 0xffffff,
      strokeThickness: 1,
      letterSpacing: 5,
    },
  };

  static prepareTextures(): void {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    if (Modal.textures == null) {
      Modal.textures = {
        infoPlate: textures["info_plate_big.png"],
        headerInfoPlate: textures["header_info_plate.png"],
      };
    }
  }

  headerText!: Text;
  sprites!: ModalSprites;

  constructor(options: ModalOptions) {
    Modal.prepareTextures();
    super();
    this.setup(options);
    if (options.visible != null) {
      this.visible = options.visible;
    }
  }

  setup({ width, height, title }: ModalOptions): void {
    this.sprites = {
      infoPlate: new Sprite(Modal.textures.infoPlate),
      headerInfoPlate: new Sprite(Modal.textures.headerInfoPlate),
    };

    this.addChild(this.sprites.infoPlate);
    this.addChild(this.sprites.headerInfoPlate);

    const headerText = new Text(title, {
      ...this.options.header,
    });
    headerText.anchor.x = 0.5;
    this.addChild(headerText);
    this.headerText = headerText;

    Scale.handleWidthHeight(this, width, height);
  }

  showModal(): void {
    this.visible = true;
  }

  hideModal(): void {
    this.visible = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleResize(options: ISceneResizeParams) {
    const { headerInfoPlate, infoPlate } = this.sprites;
    headerInfoPlate.position.x = (infoPlate.width - headerInfoPlate.width) / 2;
    headerInfoPlate.position.y = this.options.headerInfo.gap;

    this.headerText.position.x = infoPlate.width / 2;
  }
}
