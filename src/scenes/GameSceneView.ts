import { Container } from "pixi.js";
import { ISceneView } from "./IScene";

export class GameSceneView extends Container implements ISceneView {
  constructor() {
    super();
  }

  handleResize() {}
}
