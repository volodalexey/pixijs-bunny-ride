import { Assets, Container, Sprite, Spritesheet, Text, TextStyle, Texture } from "pixi.js";
import { COLOR_WHITE, FONT_FAMILY, FONT_SIZE_REGULAR } from "../utils/constants";
import { ISceneResizeParams } from "../scenes/IScene";

export class StatusBarView extends Container {
  coinsCollectedText!: Text;
  collectCoinIcon!: Sprite;
  coinScorePlate!: Sprite;
  initialWidth = -1;
  initialHeight = -1;

  static textures: {
    collectCoinIcon: Texture;
    coinScorePlate: Texture;
  };

  options = {
    gap: 10,
  };

  static differencesFoundOptions: Pick<TextStyle, "fontFamily" | "fontSize" | "fill"> = {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE_REGULAR,
    fill: COLOR_WHITE,
  };

  constructor() {
    super();

    this.setup();
  }

  setup() {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    StatusBarView.textures = {
      coinScorePlate: textures["coin_score_plate.png"],
      collectCoinIcon: textures["collect_coin_icon.png"],
    };

    const coinScorePlate = new Sprite(StatusBarView.textures.coinScorePlate);
    coinScorePlate.height = 44;
    coinScorePlate.scale.x = coinScorePlate.scale.y;
    this.addChild(coinScorePlate);
    this.coinScorePlate = coinScorePlate;

    const coinsCollectedText = new Text("0", {
      ...StatusBarView.differencesFoundOptions,
    });
    coinsCollectedText.anchor.set(0.5);
    this.addChild(coinsCollectedText);
    this.coinsCollectedText = coinsCollectedText;

    const collectCoinIcon = new Sprite(StatusBarView.textures.collectCoinIcon);
    collectCoinIcon.width = 66;
    collectCoinIcon.scale.y = collectCoinIcon.scale.x;
    this.addChild(collectCoinIcon);
    this.collectCoinIcon = collectCoinIcon;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleResize(_: ISceneResizeParams) {
    const { gap } = this.options;

    this.collectCoinIcon.position.x = gap;
    this.collectCoinIcon.position.y = gap;

    this.coinScorePlate.position.x = this.collectCoinIcon.position.x + this.collectCoinIcon.width - gap * 2;
    this.coinScorePlate.position.y =
      this.collectCoinIcon.position.y + this.collectCoinIcon.height / 2 - this.coinScorePlate.height / 2;

    this.coinsCollectedText.position.x = this.coinScorePlate.position.x + this.coinScorePlate.width / 2;
    this.coinsCollectedText.position.y =
      this.coinScorePlate.position.y + this.coinScorePlate.height / 2 + this.coinScorePlate.scale.y * 5;

    if (this.initialWidth === -1) {
      this.initialWidth = this.width;
    }
    if (this.initialHeight === -1) {
      this.initialHeight = this.height;
    }
  }
}
