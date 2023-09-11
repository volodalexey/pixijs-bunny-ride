import { Container, Graphics, Text } from "pixi.js";

class ButtonBackground extends Graphics {}
class ButtonText extends Text {}

export class Button extends Container {
  background;
  text;

  buttonIdleColor;
  buttonHoverColor;
  textColor;
  textColorHover;
  fontSize;
  onClick;

  static textOptions = {
    fontFamily: "Filmotype Major",
    fill: 0xffffff,
    align: "center",
    fontSize: 30,
    letterSpacing: 5,
  };

  constructor(options) {
    super();
    this.eventMode = "static";
    this.cursor = "pointer";
    this.onClick = options.onClick;
    this.fontSize = options.fontSize ?? 20;
    this.textColor = options.textColor ?? 0x000000;
    this.textColorHover = options.textColorHover ?? 0x000000;
    this.buttonIdleColor = options.buttonIdleColor ?? 0x000000;
    this.buttonHoverColor = options.buttonHoverColor ?? options.buttonIdleColor ?? 0x000000;
    this.setup(options);
    this.draw(options);
    this.updateState();
  }

  setup({ buttonText, buttonWidth, buttonHeight }) {
    const background = new ButtonBackground();
    this.addChild(background);
    this.background = background;

    const text = new ButtonText(buttonText, {
      ...Button.textOptions,
      fontSize: this.fontSize,
    });
    text.anchor.set(0.5, 0.5);
    text.position.set(buttonWidth / 2, buttonHeight / 2);
    this.addChild(text);
    this.text = text;

    this.setupEventLesteners();
  }

  setupEventLesteners() {
    this.on("pointertap", (e) => {
      this.updateState();
      if (typeof this.onClick === "function") {
        this.onClick(e);
      }
    });
    this.on("pointerdown", (e) => {
      if (e.pointerType === "touch") {
        this.updateState(true);
      }
    });
    this.on("pointerenter", (e) => {
      if (e.pointerType === "mouse") {
        this.updateState(true);
      }
    });
    this.on("pointerleave", (e) => {
      if (e.pointerType === "mouse") {
        this.updateState();
      }
    });
    this.on("pointerup", (e) => {
      if (e.pointerType === "touch") {
        this.updateState();
      }
    });
  }

  draw({ buttonWidth, buttonHeight, buttonRadius = 0, textPaddingTop = 0 }) {
    if (typeof buttonWidth !== "number") {
      buttonWidth = this.width;
    }
    if (typeof buttonHeight !== "number") {
      buttonHeight = textPaddingTop + this.text.height;
    }
    this.background.beginFill(0xffffff);
    this.background.drawRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius);
    this.background.endFill();
  }

  color({ bgColor, txtColor }) {
    this.background.tint = bgColor;
    this.text.tint = txtColor;
  }

  idleColor({ bgColor = this.buttonIdleColor, txtColor = this.textColor } = {}) {
    this.color({ bgColor, txtColor });
  }

  hoverColor({ bgColor = this.buttonHoverColor, txtColor = this.textColorHover } = {}) {
    this.color({ bgColor, txtColor });
  }

  updateState(hovered = false) {
    if (hovered) {
      this.hoverColor();
    } else {
      this.idleColor();
    }
  }
}
