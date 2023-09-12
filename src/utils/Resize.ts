import { Container } from "pixi.js";
import { logLayout } from "../utils/logger";

export interface HandleResizeParams {
  view: Container;
}

export interface HandleResizeParams {
  view: Container;
  availableWidth: number;
  availableHeight: number;
  contentWidth?: number;
  contentHeight?: number;
  logName?: string;
  lockX?: boolean;
  lockY?: boolean;
  lockWidth?: boolean;
  lockHeight?: boolean;
}

export abstract class Resize {
  static handleResize({
    view,
    availableWidth,
    availableHeight,
    contentWidth = view.width,
    contentHeight = view.height,
    logName = "",
    lockX = false,
    lockY = false,
    lockWidth = false,
    lockHeight = false,
  }: HandleResizeParams) {
    let occupiedWidth, occupiedHeight;
    if (availableWidth >= contentWidth && availableHeight >= contentHeight) {
      occupiedWidth = contentWidth;
      occupiedHeight = contentHeight;
      logLayout(
        `${logName} Spacing aw=${availableWidth} ow=${occupiedWidth} ah=${availableHeight} oh=${occupiedHeight}`,
      );
    } else {
      let scale = 1;
      if (contentHeight >= contentWidth) {
        scale = availableHeight / contentHeight;
        if (scale * contentWidth > availableWidth) {
          scale = availableWidth / contentWidth;
        }
        logLayout(`${logName} By height (sc=${scale})`);
      } else {
        scale = availableWidth / contentWidth;
        logLayout(`${logName} By width (sc=${scale})`);
        if (scale * contentHeight > availableHeight) {
          scale = availableHeight / contentHeight;
        }
      }
      occupiedWidth = Math.floor(contentWidth * scale);
      occupiedHeight = Math.floor(contentHeight * scale);
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
