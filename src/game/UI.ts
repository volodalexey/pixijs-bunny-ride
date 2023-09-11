// import { Container, Text } from "../lib/pixi.mjs";
// import { Resize } from "./Resize.mjs";
// import { SplitScreen } from "./SplitScreen.mjs";
// import { StatusBar } from "./StatusBar.mjs";
// import { SuccessModal } from "./SuccessModal.mjs";
// import { TitleBar } from "./TitleBar.mjs";

// export class UI {
//   #titleBar;
//   #splitScreen;
//   #statusBar;
//   #successModal;
//   #aspectRatio = 9 / 16;
//   #view = new Container();
//   onSuccessResult;
//   onErrorResult;

//   static options = {
//     gap: 10
//   }

//   constructor({ onSuccessResult, onErrorResult, onNextLevel }) {
//     this.onSuccessResult = onSuccessResult;
//     this.onErrorResult = onErrorResult;
//     this.onNextLevel = onNextLevel;
//     this.setup()
//   }

//   get view() {
//     return this.#view;
//   }

//   setup() {
//     const titleBar = new TitleBar();
//     this.#view.addChild(titleBar.view);
//     this.#titleBar = titleBar;

//     const splitScreen = new SplitScreen({ onSuccessResult: this.handleSuccessResult, onErrorResult: this.handleErrorResult });
//     this.#view.addChild(splitScreen.view);
//     this.#splitScreen = splitScreen;

//     const statusBar = new StatusBar();
//     this.#view.addChild(statusBar.view);
//     this.#statusBar = statusBar;

//     const startModal = new SuccessModal({ onClick: () => { this.onNextLevel(); } })
//     startModal.hideModal();
//     this.#view.addChild(startModal);
//     this.#successModal = startModal;
//   }

//   setTitle(level) {
//     this.#titleBar.setTitle(level);
//   }

//   setDifferencesCount(current, total) {
//     this.#statusBar.setDifferencesCount(current, total);
//   }

//   setErrorsCount(current, total) {
//     this.#statusBar.setErrorsCount(current, total);
//   }

//   handleResize({ viewWidth, viewHeight }) {
//     /*
//     -------------------
//     |       gap       |
//     -------------------
//     |      title      |
//     -------------------
//     |       gap       |
//     -------------------
//     |gap|  split  |gap|
//     -------------------
//     |       gap       |
//     -------------------
//     |      status     |
//     -------------------
//     |       gap       |
//     -------------------
//     */
//     let childWidth = viewWidth;
//     let childHeight = viewHeight;
//     if (childHeight >= childWidth) {
//       childWidth = childHeight * this.#aspectRatio;
//     } else {
//       childHeight = childWidth * this.#aspectRatio;
//     }
//     let childContainer = { x: 0, y: 0, width: 0, height: 0 };
//     Resize.handleResize({
//       view: childContainer,
//       availableWidth: viewWidth,
//       availableHeight: viewHeight,
//       totalWidth: childWidth,
//       totalHeight: childHeight,
//     }, {
//       logName: 'UI before', lockX: true, lockY: true,
//     });
//     childWidth = childContainer.width;
//     childHeight = childContainer.height;

//     let titleBarView = this.#titleBar.view;
//     titleBarView.position.y = UI.options.gap;

//     let splitScreenView = this.#splitScreen.view;
//     let statusBarView = this.#statusBar.view;

//     splitScreenView.position.y = titleBarView.position.y + titleBarView.height + UI.options.gap;
//     let leftHeight = childHeight - (titleBarView.height + statusBarView.height + UI.options.gap * 4);
//     this.#splitScreen.handleResize({ viewWidth: childWidth - UI.options.gap * 2, viewHeight: leftHeight });

//     statusBarView.position.y = splitScreenView.y + splitScreenView.height + UI.options.gap;

//     // split screen has the most width
//     // resize width for title and status after scplit screen
//     titleBarView.position.x = splitScreenView.width / 2;
//     this.#statusBar.handleResize({ viewWidth: splitScreenView.width });

//     const availableWidth = viewWidth
//     const availableHeight = viewHeight
//     const totalWidth = splitScreenView.width;
//     const totalHeight = UI.options.gap + titleBarView.height + UI.options.gap + splitScreenView.height + UI.options.gap + statusBarView.height + UI.options.gap;
//     Resize.handleResize({
//       view: this.#view, availableWidth, availableHeight, totalWidth, totalHeight
//     }, {
//       logName: 'UI after', lockWidth: true, lockHeight: true,
//     });
//     Resize.handleResize({
//       view: this.#successModal,
//       availableWidth: totalWidth,
//       availableHeight: totalHeight,
//       totalWidth: this.#successModal.width,
//       totalHeight: this.#successModal.height,
//     }, {
//       logName: 'Success modal', lockWidth: true, lockHeight: true,
//     });
//   }

//   setLevelData(levelData) {
//     this.#splitScreen.setLevelData(levelData);
//   }

//   handleUpdate() {
//     this.#splitScreen.handleUpdate();
//   }

//   setDifferencesCount(current, total) {
//     this.#statusBar.setDifferencesCount(current, total)
//   }

//   setErrorsCount(count) {
//     this.#statusBar.setErrorsCount(count)
//   }

//   handleSuccessResult = () => {
//     this.onSuccessResult();
//   }

//   handleErrorResult = () => {
//     this.onErrorResult();
//   }

//   toggleSuccessModal(toggle) {
//     if (toggle) {
//       this.#successModal.showModal();
//       this.#splitScreen.toggleDisabled(true);
//     } else {
//       this.#successModal.hideModal();
//       this.#splitScreen.toggleDisabled(false);
//     }
//   }
// }
