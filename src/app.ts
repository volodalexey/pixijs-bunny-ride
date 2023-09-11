import "./styles.css";
import { SceneManager } from "./scenes/SceneManager";
import { LoaderScene } from "./scenes/LoaderScene";
// import { GameScene } from "./scenes/GameScene";

async function run() {
  const loader = document.querySelector(".loader");
  if (loader != null) {
    loader.parentElement?.removeChild(loader);
  }
  await SceneManager.initialize();
  const loaderScene = new LoaderScene();
  await SceneManager.changeScene({ newScene: loaderScene });
  await loaderScene.loadAll();
  // const gameScene = new GameScene({
  //   app: SceneManager.app,
  //   viewWidth: SceneManager.width,
  //   viewHeight: SceneManager.height,
  // });
  // await SceneManager.changeScene({
  //   newScene: gameScene
  // })

  document.addEventListener("keydown", (e) => {
    console.log(e.code);
  });
}

function printError(err: Error) {
  console.error(err);
  const errorMessageDiv: HTMLElement | null = document.querySelector(".error-message");
  if (errorMessageDiv != null) {
    errorMessageDiv.classList.remove("hidden");
    errorMessageDiv.innerText = err?.message ?? String(err);
  }
  const errorStackDiv: HTMLElement | null = document.querySelector(".error-stack");
  if (errorStackDiv != null) {
    errorStackDiv.classList.remove("hidden");
    errorStackDiv.innerText = err?.stack ?? "";
  }
  const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
  if (canvas != null) {
    canvas.parentElement?.removeChild(canvas);
  }
}

run().catch(printError);
