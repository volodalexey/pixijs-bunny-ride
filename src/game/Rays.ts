import { Assets, Sprite, Spritesheet } from "pixi.js";

export class Rays extends Sprite {
  internalAngle = 0;
  rotationSpeed = 0.0001;
  va = 0.05;

  constructor() {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    super(textures["rays.png"]);
    this.anchor.set(0.5, 0.5);
  }

  handleUpdate(deltaMS: number) {
    this.internalAngle += this.va;
    this.rotation += Math.sin(this.internalAngle) * this.rotationSpeed * deltaMS;
  }
}
