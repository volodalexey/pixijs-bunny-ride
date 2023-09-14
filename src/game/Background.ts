import { Container, TilingSprite, type Texture, Spritesheet, Assets, Graphics, Sprite } from "pixi.js";
import { Game } from "./Game";
import { ISceneResizeParams } from "../scenes/IScene";
import { COLOR_LIGHT_BLUE } from "../utils/constants";
import { MiscLayer } from "./Misc";

interface ILayerOptions {
  game: Game;
  speedModifier: number;
  layerWidth?: number;
  layerHeight?: number;
  texture: Texture;
  scale?: number;
}

class TilingLayer extends TilingSprite {
  public game!: Game;
  public speedModifier!: number;
  constructor({ game, texture, layerWidth, layerHeight, speedModifier, scale }: ILayerOptions) {
    super(texture, layerWidth, layerHeight);
    this.game = game;
    this.speedModifier = speedModifier;
    if (Number.isFinite(scale)) {
      this.tileScale.set(<number>scale);
    }
  }

  handleUpdate(deltaMS: number): void {
    this.tilePosition.x -= this.game.speed * this.speedModifier * deltaMS;
  }
}

class SkyLayer extends Container {
  skyBackground!: Graphics;
  sun: Sprite;
  constructor() {
    super();
    this.skyBackground = new Graphics();
    this.skyBackground.beginFill(COLOR_LIGHT_BLUE);
    this.skyBackground.drawRect(0, 0, 500, 500);
    this.skyBackground.endFill();
    this.addChild(this.skyBackground);

    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    this.sun = new Sprite(textures["bg_sun.png"]);
    this.addChild(this.sun);
  }

  handleResize({ viewWidth, viewHeight }: ISceneResizeParams) {
    this.skyBackground.width = viewWidth;
    this.skyBackground.height = viewHeight;
  }
}

export interface IBackgroundOptions {
  game: Game;
}

export class Background extends Container {
  game!: Game;

  skyLayer!: SkyLayer;
  layers!: Container<TilingLayer>;
  floorLayer!: TilingLayer;
  rocksLayer!: TilingLayer;
  miscLayer!: MiscLayer;

  options = {
    rocksYAdd: 10,
  };

  constructor(options: IBackgroundOptions) {
    super();
    this.game = options.game;

    this.setup();
  }

  setup() {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    this.skyLayer = new SkyLayer();
    this.addChild(this.skyLayer);

    this.layers = new Container<TilingLayer>();

    this.floorLayer = new TilingLayer({
      game: this.game,
      speedModifier: 1,
      texture: textures["floor.png"],
    });

    this.rocksLayer = new TilingLayer({
      game: this.game,
      speedModifier: 0.1,
      texture: textures["back_rocks.png"],
      layerHeight: 310,
      scale: 0.4,
    });

    this.layers.addChild(this.rocksLayer);
    this.layers.addChild(this.floorLayer);

    this.addChild(this.layers);

    this.miscLayer = new MiscLayer({ game: this.game });
    this.addChild(this.miscLayer);
  }

  handleUpdate(deltaMS: number) {
    this.miscLayer.handleUpdate(deltaMS);
    this.layers.children.forEach((layer) => {
      layer.handleUpdate(deltaMS);
    });
  }

  handleResize(options: ISceneResizeParams) {
    const { viewWidth, viewHeight } = options;
    this.skyLayer.handleResize(options);

    this.floorLayer.width = viewWidth;
    this.floorLayer.height = this.game.options.groundMargin;
    this.floorLayer.position.y = viewHeight - this.game.options.groundMargin;

    this.rocksLayer.width = viewWidth;
    this.rocksLayer.position.y =
      viewHeight - this.game.options.groundMargin - this.rocksLayer.height + this.options.rocksYAdd;
  }
}
