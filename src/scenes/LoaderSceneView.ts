import { Container, Graphics, Text, Texture } from "pixi.js";
import { Resize } from "../utils/Resize";
import { ISceneResizeParams, ISceneView } from "./IScene";
import { SceneManager } from "./SceneManager";

export class LoaderSceneView extends Container implements ISceneView {
  #loaderTitle!: Text;
  #loaderBar!: Container;
  #loaderBarFill!: Graphics;
  #loaderBarBorder!: Graphics;
  static barOptions = {
    initWidth: 10,
    width: 350,
    height: 40,
    fillColor: 0x183dd0,
    borderRadius: 5,
    borderThick: 5,
    borderColor: 0x000000,
  };

  static titleText = "Загрузка";
  static titleOptions = {
    fontFamily: "Zubilo Black",
    fontSize: 30,
    fill: 0x00cc00,
    stroke: 0xffffff,
    strokeThickness: 1,
    letterSpacing: 5,
  };

  static progressBarTexture: Texture;
  static progressSliderTexture: Texture;

  constructor() {
    super();

    this.setup();
    this.draw();
  }

  setup() {
    const loaderTitle = new Text(LoaderSceneView.titleText, {
      ...LoaderSceneView.titleOptions,
    });
    this.addChild(loaderTitle);
    this.#loaderTitle = loaderTitle;

    const loaderBar = new Container();
    this.addChild(loaderBar);
    loaderBar.position.y = LoaderSceneView.titleOptions.fontSize * 1.2;
    this.#loaderBar = loaderBar;

    const loaderBarBorder = new Graphics();
    loaderBar.addChild(loaderBarBorder);
    this.#loaderBarBorder = loaderBarBorder;

    const loaderBarFill = new Graphics();
    loaderBar.addChild(loaderBarFill);
    this.#loaderBarFill = loaderBarFill;
  }

  draw() {
    const { barOptions } = LoaderSceneView;
    const loaderBarFill = this.#loaderBarFill;
    const loaderBarBorder = this.#loaderBarBorder;
    loaderBarBorder.beginFill(barOptions.borderColor);
    loaderBarBorder.drawRoundedRect(0, 0, barOptions.width, barOptions.height, barOptions.borderRadius);
    loaderBarBorder.endFill();

    loaderBarFill.beginFill(barOptions.fillColor);
    loaderBarFill.position.set(barOptions.borderThick, barOptions.borderThick);
    loaderBarFill.drawRoundedRect(
      0,
      0,
      barOptions.width - barOptions.borderThick * 2,
      barOptions.height - barOptions.borderThick * 2,
      barOptions.borderRadius,
    );
    loaderBarFill.endFill();
  }

  downloadStarted = () => {
    this.#loaderBarFill.width = LoaderSceneView.barOptions.initWidth;
  };

  updateTitle(dots?: string) {
    dots ??= Array(Math.ceil(Math.random() * 3))
      .fill(".")
      .join("");
    this.#loaderTitle.text = LoaderSceneView.titleText + dots;
  }

  downloadProgress = (progressRatio: number) => {
    this.#loaderBarFill.width =
      (LoaderSceneView.barOptions.width - LoaderSceneView.barOptions.borderThick * 2) * progressRatio;
    this.handleResize({ viewWidth: SceneManager.width, viewHeight: SceneManager.height });
    this.updateTitle();
  };

  handleResize({ viewWidth, viewHeight }: ISceneResizeParams) {
    const availableWidth = viewWidth;
    const availableHeight = viewHeight;
    const totalWidth = LoaderSceneView.barOptions.width;
    const totalHeight = this.#loaderTitle.height + LoaderSceneView.barOptions.height;
    this.updateTitle("");
    Resize.handleResize({
      view: this.#loaderBar,
      availableWidth,
      availableHeight,
      totalWidth,
      totalHeight,
      lockX: true,
      lockY: true,
    });
    Resize.handleResize({
      view: this.#loaderTitle,
      availableWidth: this.#loaderBar.width,
      availableHeight,
      totalWidth: this.#loaderTitle.width,
      totalHeight,
      lockWidth: true,
      lockHeight: true,
      lockY: true,
    });
    Resize.handleResize({
      view: this,
      availableWidth,
      availableHeight,
      totalWidth,
      totalHeight,
      lockWidth: true,
      lockHeight: true,
    });
  }
}
