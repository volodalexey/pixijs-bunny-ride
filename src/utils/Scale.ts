import { Container } from "pixi.js";
import { logWidthHeight } from "./logger";

export abstract class Scale {
  static handleWidthHeight(object: Container, width?: number, height?: number) {
    const isWidth = Number.isFinite(width);
    const isHeight = Number.isFinite(height);
    logWidthHeight(`isWidth=${isWidth} isHeight=${isHeight}`);
    if (isWidth && isHeight) {
      logWidthHeight(`>> w & h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
      object.width = <number>width;
      object.height = <number>height;
      logWidthHeight(`w & h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
    } else if (isWidth && !isHeight) {
      logWidthHeight(`>> w !h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
      object.width = <number>width;
      object.scale.y = object.scale.x;
      logWidthHeight(`w !h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
    } else if (!isWidth && isHeight) {
      logWidthHeight(`>> !w h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
      object.height = <number>height;
      object.scale.x = object.scale.y;
      logWidthHeight(`!w h ${object.width} ${object.height} sx=${object.scale.x} sy=${object.scale.y}`);
    }
  }
}
