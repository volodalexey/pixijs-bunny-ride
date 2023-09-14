import debug from "debug";

const APP_NAME = `bunny-ride-`; // e.g. localStorage.setItem('debug', 'bunny-ride-app')

function intoLogName(logName: string): string {
  return `${APP_NAME}${logName}`;
}

export const logApp = debug(intoLogName("app"));
export const logLoader = debug(intoLogName("loader"));
export const logLayout = debug(intoLogName("layout"));
export const logWidthHeight = debug(intoLogName("width-height"));
export const logHeroState = debug(intoLogName("hero"));
export const logInputDirection = debug(intoLogName("input-direction"));
export const logKeydown = debug(intoLogName("keydown"));
export const logKeyup = debug(intoLogName("keyup"));
export const logPointerEvent = debug(intoLogName("pointer-event"));
