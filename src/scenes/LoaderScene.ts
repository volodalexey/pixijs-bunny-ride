import { Assets, ResolverManifest } from "pixi.js";
import { LoaderSceneView } from "./LoaderSceneView";
import { IScene, ISceneResizeParams } from "./IScene";

export const manifest: ResolverManifest = {
  bundles: [
    {
      name: "initial-bundle",
      assets: {
        spritesheet: "assets/spritesheets/atlas.json",
        font: "assets/fonts/Zubilo_Black.woff2",
      },
    },
  ],
};

export class LoaderScene implements IScene {
  name = "loader";

  #view: LoaderSceneView;
  constructor() {
    this.#view = new LoaderSceneView();
  }

  get view() {
    return this.#view;
  }

  async loadAll() {
    this.#view.downloadStarted();
    await Assets.init({ manifest });
    await Assets.loadBundle(manifest.bundles[0].name, this.handleProgress);
  }

  handleResize(options: ISceneResizeParams) {
    this.#view.handleResize(options);
  }

  handleProgress = (progressRatio: number) => {
    this.#view.downloadProgress(progressRatio);
  };

  handleMounted() {}

  handleUpdate() {
    this.#view.updateTitle();
  }
}
