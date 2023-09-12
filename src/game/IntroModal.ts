import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";

export interface IntroModalOptions extends ModalOptions {
  visible?: boolean;
}

export class IntroModal extends Modal {
  constructor(options: IntroModalOptions) {
    super({ ...options, width: 500 });

    this.setupContent();
  }

  setupContent() {}

  handleResize(options: ISceneResizeParams) {
    super.handleResize(options);
  }
}
