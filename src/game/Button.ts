import { Assets, Container, FederatedPointerEvent, Sprite, Spritesheet, Texture } from "pixi.js";

export interface IconButtonOptions {
  width?: number;
  height?: number;
  textureNames: { active: string; hover: string; press: string };
  onClick?: (e: FederatedPointerEvent) => void;
}

type ButtonStateTextures = { active: Texture; hover: Texture; press: Texture };
type ButtonStateSprites = { active: Sprite; hover: Sprite; press: Sprite };

export class IconButton extends Container {
  textures!: ButtonStateTextures;
  sprites!: ButtonStateSprites;

  onClick!: IconButtonOptions["onClick"];

  constructor(options: IconButtonOptions) {
    super();

    this.eventMode = "static";
    this.cursor = "pointer";
    this.onClick = options.onClick;

    this.setup(options);
    this.updateState();
  }

  setup({ width, height, textureNames }: IconButtonOptions) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    this.textures = {
      active: textures[textureNames.active],
      hover: textures[textureNames.hover],
      press: textures[textureNames.press],
    };

    this.sprites = {
      active: new Sprite(this.textures.active),
      hover: new Sprite(this.textures.hover),
      press: new Sprite(this.textures.press),
    };

    this.addChild(this.sprites.active);
    this.addChild(this.sprites.hover);
    this.addChild(this.sprites.press);

    const isWidth = Number.isFinite(width);
    const isHeight = Number.isFinite(height);
    if (isWidth && isHeight) {
      this.width = <number>width;
      this.height = <number>height;
    } else if (isWidth && !isHeight) {
      this.width = <number>width;
      this.scale.y = this.scale.x;
    } else if (!isWidth && isHeight) {
      this.height = <number>height;
      this.scale.x = this.scale.y;
    }

    this.setupEventLesteners();
  }

  setupEventLesteners() {
    this.on("pointerdown", (e) => {
      this.updateState(false, true);
      if (typeof this.onClick === "function") {
        this.onClick(e);
      }
    });
    this.on("pointerover", () => {
      this.updateState(true, false);
    });
    this.on("pointerup", () => {
      this.updateState(false, false);
    });
    this.on("pointerleave", () => {
      this.updateState(false, false);
    });
  }

  hideAll() {
    this.children.forEach((sprite) => {
      sprite.visible = false;
    });
  }

  idleState() {
    this.hideAll();
    this.sprites.active.visible = true;
  }

  hoverState() {
    this.hideAll();
    this.sprites.hover.visible = true;
  }

  pressedState() {
    this.hideAll();
    this.sprites.press.visible = true;
  }

  updateState(hovered = false, pressed = false) {
    if (pressed) {
      this.pressedState();
    } else {
      if (hovered) {
        this.hoverState();
      } else {
        this.idleState();
      }
    }
  }
}
