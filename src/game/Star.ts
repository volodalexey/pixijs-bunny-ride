import { Assets, Container, Sprite, Spritesheet } from "pixi.js";

export class Star extends Sprite {
  internalAngle = 0;
  rotationSpeed = 0.0001;
  va = 0;

  constructor() {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    super(textures["star.png"]);
    this.va = 0.05 + 0.05 * Math.random();
    this.anchor.set(0.5, 0.5);
    this.scale.set(0.5 + 0.5 * Math.random());
  }

  handleUpdate(deltaMS: number) {
    this.internalAngle += this.va;
    this.rotation += Math.sin(this.internalAngle) * this.rotationSpeed * deltaMS;
  }
}

export class Stars extends Container<Star> {
  handleUpdate(deltaMS: number) {
    this.children.forEach((star) => {
      star.handleUpdate(deltaMS);
    });
  }
}
