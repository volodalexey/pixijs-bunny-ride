import { Text, TextStyle } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";
import { COLOR_BLUE, COLOR_GREEN, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";
import { IconButton } from "./Button";
import { TextInput } from "./TextInput";

export interface IntroModalOptions extends Omit<ModalOptions, "title"> {
  visible?: boolean;
}

export class IntroModal extends Modal {
  recordText!: Text;
  loginButton!: IconButton;
  userName!: TextInput;
  leadboardButton!: IconButton;
  playButton!: IconButton;

  introOptions = {
    recordGap: 10,
    loginButtonGap: 40,
    userNameGap: 40,
    userNamePadding: 40,
    actionsGap: 40,
    record: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL * 1.1,
      fill: COLOR_GREEN,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
      letterSpacing: 5,
    },
  };

  constructor(options: IntroModalOptions) {
    super({ ...options, title: "Твои рекорды:" });

    this.setupContent();
  }

  getRecordText(coinsCollected = 0) {
    return `Рекорд:\n${coinsCollected}`;
  }

  setupContent() {
    const recordText = new Text(this.getRecordText(), {
      ...this.introOptions.record,
    });
    recordText.anchor.x = 0.5;
    this.addChild(recordText);
    this.recordText = recordText;

    this.loginButton = new IconButton({
      textureNames: {
        active: "login_button_active.png",
        hover: "login_button_hover.png",
        press: "login_button_press.png",
      },
    });
    this.addChild(this.loginButton);

    this.userName = new TextInput({
      textureName: "user_name_bar.png",
      text: "Test username",
    });
    this.addChild(this.userName);

    this.leadboardButton = new IconButton({
      textureNames: {
        active: "leadboard_button_active.png",
        hover: "leadboard_button_hover.png",
        press: "leadboard_button_press.png",
      },
    });
    this.addChild(this.leadboardButton);

    this.playButton = new IconButton({
      textureNames: {
        active: "play_button_active.png",
        hover: "play_button_hover.png",
        press: "play_button_press.png",
      },
    });
    this.addChild(this.playButton);
  }

  handleResize(options: ISceneResizeParams) {
    super.handleResize(options);

    const middleX = this.sprites.infoPlate.width / 2;

    this.recordText.position.x = middleX;
    this.recordText.position.y =
      this.sprites.headerInfoPlate.y + this.sprites.headerInfoPlate.height + this.introOptions.recordGap;

    this.loginButton.position.x = middleX - this.loginButton.width / 2;
    this.loginButton.position.y =
      this.recordText.position.y + this.recordText.height + this.introOptions.loginButtonGap;

    this.userName.handleResize(options);
    this.userName.position.x = middleX - this.userName.width / 2;
    this.userName.position.y = this.loginButton.position.y + this.loginButton.height + this.introOptions.userNameGap;

    this.leadboardButton.position.x = middleX - this.leadboardButton.width;
    this.leadboardButton.position.y = this.userName.position.y + this.userName.height + this.introOptions.actionsGap;

    this.playButton.position.x = middleX;
    this.playButton.position.y = this.userName.position.y + this.userName.height + this.introOptions.actionsGap;
  }
}
