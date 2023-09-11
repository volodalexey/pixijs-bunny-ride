import { Container } from "pixi.js";
import { logLayout } from "../utils/logger";

export interface HandleResizeParams {
  view: Container;
}

export interface HandleResizeParams {
  view: Container;
  availableWidth: number;
  availableHeight: number;
  totalWidth: number;
  totalHeight: number;
  logName?: string;
  lockX?: boolean;
  lockY?: boolean;
  lockWidth?: boolean;
  lockHeight?: boolean;
}

export class Resize {
  static handleResize({
    view,
    availableWidth,
    availableHeight,
    totalWidth,
    totalHeight,
    logName = "",
    lockX = false,
    lockY = false,
    lockWidth = false,
    lockHeight = false,
  }: HandleResizeParams) {
    let occupiedWidth, occupiedHeight;
    if (availableWidth >= totalWidth && availableHeight >= totalHeight) {
      occupiedWidth = totalWidth;
      occupiedHeight = totalHeight;
      logLayout(
        `${logName} Spacing aw=${availableWidth} ow=${occupiedWidth} ah=${availableHeight} oh=${occupiedHeight}`,
      );
    } else {
      let scale = 1;
      if (totalHeight >= totalWidth) {
        scale = availableHeight / totalHeight;
        if (scale * totalWidth > availableWidth) {
          scale = availableWidth / totalWidth;
        }
        logLayout(`${logName} By height (sc=${scale})`);
      } else {
        scale = availableWidth / totalWidth;
        logLayout(`${logName} By width (sc=${scale})`);
        if (scale * totalHeight > availableHeight) {
          scale = availableHeight / totalHeight;
        }
      }
      occupiedWidth = Math.floor(totalWidth * scale);
      occupiedHeight = Math.floor(totalHeight * scale);
      logLayout(
        `${logName} Scaling aw=${availableWidth} (ow=${occupiedWidth}) ah=${availableHeight} (oh=${occupiedHeight})`,
      );
    }
    const x = availableWidth > occupiedWidth ? (availableWidth - occupiedWidth) / 2 : 0;
    const y = availableHeight > occupiedHeight ? (availableHeight - occupiedHeight) / 2 : 0;
    if (!lockX) {
      view.x = x;
      logLayout(`${logName} set x=${x}`);
    }
    if (!lockWidth) {
      view.width = occupiedWidth;
      logLayout(`${logName} set width=${occupiedWidth}`);
    }
    if (!lockY) {
      view.y = y;
      logLayout(`${logName} set y=${y}`);
    }
    if (!lockHeight) {
      view.height = occupiedHeight;
      logLayout(`${logName} set height=${occupiedHeight}`);
    }
  }
}
