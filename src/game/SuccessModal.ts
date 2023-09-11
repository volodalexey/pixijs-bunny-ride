// import { Container, Graphics, ParticleContainer, Text } from "pixi.js";
// import { SceneManager } from "../scenes/SceneManager";
// import { Button } from "./Button.mjs";

// class ModalBox extends Graphics {}
// class ReasonText extends Text {}
// class DynamicContent extends Container {}

// export class SuccessModal extends Container {
//   onClick;
//   elapsedSpawnFrames = 0;
//   spawnFrame = Math.floor(Math.random() * 20 + 60);
//   modalBox;
//   particles;
//   dynamicContent;

//   static boxOptions = {
//     backgroundColor: 0x454545,
//     outerBorderColor: 0x485b6c,
//     outerBorderWidth: 3,
//     width: 350,
//     height: 250,
//     borderRadius: 5,
//   };

//   static reasonTextOptions = {
//     top: -50,
//     fill: 0xdeb887,
//     fontSize: 30,
//     fontFamily: "Filmotype Major",
//     lineHeight: 30,
//     letterSpacing: 2,
//     align: "center",
//     wordWrap: true,
//   };

//   static buttonOptions = {
//     top: 150,
//     left: 100,
//     buttonText: "Далее",
//     buttonWidth: 150,
//     buttonHeight: 50,
//     buttonRadius: 10,
//     buttonIdleColor: 0x4caf50,
//     buttonHoverColor: 0x2f6a31,
//     textColor: 0xdeb887,
//     textColorHover: 0xdeb887,
//     fontSize: 30,
//   };

//   static buttonTextOptions = {
//     top: 95,
//     textColor: 0xffffff,
//     textSize: 20,
//     textColorHover: 0xffff00,
//   };

//   constructor({ onClick }) {
//     super();
//     this.onClick = onClick;
//     this.setup();
//     this.draw();
//     SceneManager.app.ticker.add(this.handleUpdate);
//   }

//   setup() {
//     this.modalBox = new ModalBox();
//     this.addChild(this.modalBox);

//     const { boxOptions, reasonTextOptions, buttonOptions } = SuccessModal;

//     const reasonText = new ReasonText("Отлично!\nИграем дальше?", {
//       ...reasonTextOptions,
//       wordWrapWidth: boxOptions.width - boxOptions.outerBorderWidth * 2,
//     });
//     reasonText.anchor.set(0.5, 0.5);
//     reasonText.position.set(boxOptions.width / 2, boxOptions.height / 2 + reasonTextOptions.top);
//     this.addChild(reasonText);
//     this.reasonText = reasonText;

//     const button = new Button({
//       ...buttonOptions,
//       onClick: this.onClick,
//     });
//     button.position.set(buttonOptions.left, buttonOptions.top);
//     this.addChild(button);

//     const particles = new ParticleContainer(300, { position: true, scale: true, tint: true });
//     this.addChild(particles);
//     this.particles = particles;
//   }

//   draw() {
//     const {
//       boxOptions: { width, height, backgroundColor, outerBorderWidth, outerBorderColor, borderRadius },
//     } = SuccessModal;

//     let offsetX = 0;
//     let offsetY = 0;
//     let leftWidth = width;
//     let leftHeight = height;

//     this.modalBox.beginFill(backgroundColor);
//     this.modalBox.drawRoundedRect(offsetX, offsetY, leftWidth, leftHeight, borderRadius);
//     this.modalBox.endFill();

//     offsetX += outerBorderWidth;
//     offsetY += outerBorderWidth;
//     leftWidth -= outerBorderWidth * 2;
//     leftHeight -= outerBorderWidth * 2;

//     this.modalBox.beginFill(outerBorderColor);
//     this.modalBox.drawRoundedRect(offsetX, offsetY, leftWidth, leftHeight, borderRadius);
//     this.modalBox.endFill();
//   }

//   showModal() {
//     this.visible = true;
//     this.cleanFromAll();
//   }

//   hideModal() {
//     this.visible = false;
//   }

//   cleanFromAll() {
//     while (this.particles.children[0] != null) {
//       this.particles.children[0].removeFromParent();
//     }
//   }

//   handleUpdate = () => {
//     if (this.visible) {
//       this.particles.children.forEach((particle) => {
//         particle.handleUpdate();
//       });
//       if (this.elapsedSpawnFrames >= this.spawnFrame) {
//         const position = { x: Math.random() * this.width, y: Math.random() * this.height };
//         for (let i = 0; i < 30; i++) {
//           const particle = new Particle();
//           this.particles.addChild(particle);
//           particle.position.set(position.x, position.y);
//         }
//         this.spawnFrame = Math.floor(Math.random() * 20 + 60);
//         this.elapsedSpawnFrames = 0;
//       }
//       this.elapsedSpawnFrames += 1;

//       for (let i = 0; i < this.particles.children.length; i++) {
//         const particle = this.particles.children[i];
//         if (particle.markedForDeletion) {
//           particle.removeFromParent();
//           i--;
//         }
//       }
//     }
//   };
// }
