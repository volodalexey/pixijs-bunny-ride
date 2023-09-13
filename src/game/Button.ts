import { Assets, Container, FederatedPointerEvent, Sprite, Spritesheet, Texture } from "pixi.js";
import { Scale } from "../utils/Scale";

export interface IconButtonOptions {
  pressed?: boolean;
  externalPressed?: boolean;
  width?: number;
  height?: number;
  textureNames: { active: string; hover: string; press: string };
  onClick?: (e: FederatedPointerEvent) => void;
  flip?: boolean;
}

type ButtonStateTextures = { active: Texture; hover: Texture; press: Texture };
type ButtonStateSprites = { active: Sprite; hover: Sprite; press: Sprite };

export class IconButton extends Container {
  pressed = false;
  externalPressed: IconButtonOptions["externalPressed"];
  textures!: ButtonStateTextures;
  sprites!: ButtonStateSprites;

  onClick!: IconButtonOptions["onClick"];

  constructor(options: IconButtonOptions) {
    super();

    if (options.pressed != null) {
      this.pressed = options.pressed;
    }
    this.externalPressed = options.externalPressed;

    this.eventMode = "static";
    this.cursor = "pointer";
    this.onClick = options.onClick;

    this.setup(options);
    this.updateState(false, this.pressed);
  }

  setup({ width, height, textureNames, flip }: IconButtonOptions) {
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

    if (flip) {
      Object.values(this.sprites).forEach((sprite) => {
        sprite.anchor.set(1, 0);
        sprite.scale.x = -1;
      });
    }

    this.addChild(this.sprites.active);
    this.addChild(this.sprites.hover);
    this.addChild(this.sprites.press);

    Scale.handleWidthHeight(this, width, height);

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
    if (this.externalPressed != null) {
      pressed = this.externalPressed;
    }
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
