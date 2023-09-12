import debug from "debug";

const APP_NAME = `bunny-ride-`; // e.g. localStorage.setItem('debug', 'bunny-ride-app')

function intoLogName(logName: string): string {
  return `${APP_NAME}${logName}`;
}

export const logApp = debug(intoLogName("app"));
export const logLoader = debug(intoLogName("loader"));
export const logLayout = debug(intoLogName("layout"));
export const logWidthHeight = debug(intoLogName("width-height"));
