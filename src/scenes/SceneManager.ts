import { Application } from "pixi.js";
import { logApp } from "../utils/logger";
import { IScene, ISceneResizeParams, PixiApp } from "./IScene";

declare global {
  interface Window {
    __PIXI_APP__: PixiApp;
  }
}

export class SceneManager {
  static app: PixiApp;
  static currentScene: IScene;
  static resizeTimeoutId: number;
  static resizeTimeout = 300;
  static scenes = new Map<string, IScene>();

  static get width() {
    return window.innerWidth;
  }

  static get height() {
    return window.innerHeight;
  }

  static intoResizeParams(): ISceneResizeParams {
    return { viewWidth: this.width, viewHeight: this.height };
  }

  static async initialize() {
    const app = new Application<HTMLCanvasElement>({
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      width: SceneManager.width,
      height: SceneManager.height,
      resizeTo: window,
    });
    document.body.appendChild(app.view);
    if (logApp.enabled) {
      logApp("window.__PIXI_APP__ initialized!");
      window.__PIXI_APP__ = app;
    }

    SceneManager.app = app;

    SceneManager.setupEventLesteners();
  }

  static setupEventLesteners() {
    window.addEventListener("resize", SceneManager.resizeDeBounce);
    SceneManager.app.ticker.add(SceneManager.updateHandler);
  }

  static async changeScene({
    name,
    newScene,
    initialResize = true,
  }: {
    name?: string;
    newScene?: IScene;
    initialResize?: boolean;
  }) {
    if (newScene != null) {
      if (!SceneManager.scenes.has(newScene.name)) {
        SceneManager.scenes.set(newScene.name, newScene);
      }
    } else if (name != null) {
      newScene = SceneManager.scenes.get(name);
    }
    if (newScene == null) {
      throw new Error("Unable to detect new scene");
    }
    if (SceneManager.currentScene != null) {
      SceneManager.app.stage.removeChild(SceneManager.currentScene.view);
      if (typeof SceneManager.currentScene.unmountedHandler === "function") {
        SceneManager.currentScene.unmountedHandler();
      }
    }

    SceneManager.currentScene = newScene;
    SceneManager.app.stage.addChild(SceneManager.currentScene.view);

    if (initialResize) {
      SceneManager.resizeHandler();
    }

    if (typeof newScene.mountedHandler === "function") {
      newScene.mountedHandler();
    }
  }

  static resizeDeBounce() {
    SceneManager.cancelScheduledResizeHandler();
    SceneManager.scheduleResizeHandler();
  }

  static cancelScheduledResizeHandler() {
    clearTimeout(SceneManager.resizeTimeoutId);
  }

  static scheduleResizeHandler() {
    SceneManager.resizeTimeoutId = window.setTimeout(() => {
      SceneManager.cancelScheduledResizeHandler();
      SceneManager.resizeHandler();
    }, SceneManager.resizeTimeout);
  }

  static resizeHandler() {
    SceneManager.currentScene?.handleResize(SceneManager.intoResizeParams());
  }

  static updateHandler() {
    SceneManager.currentScene?.handleUpdate(SceneManager.app.ticker.deltaMS);
  }
}
