import { Text, TextStyle } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";
import { COLOR_BLUE, COLOR_ORANGE, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";
import { IconButton } from "./Button";

export interface LeadboardModalOptions extends Omit<ModalOptions, "title"> {
  visible?: boolean;
}

enum TimeSpan {
  allTime,
  month,
  week,
}

export class LeadboardModal extends Modal {
  timeSpan: TimeSpan = TimeSpan.allTime;
  timeSpanText!: Text;
  okButton!: IconButton;

  leadboardOptions = {
    timeSpanGap: 20,
    okButtonGap: 40,
    timeSpan: <
      Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "stroke" | "strokeThickness" | "letterSpacing" | "align">
    >{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL,
      fill: COLOR_ORANGE,
      stroke: COLOR_BLUE,
      strokeThickness: 5,
      letterSpacing: 5,
    },
  };

  constructor(options: LeadboardModalOptions) {
    super({ ...options, title: "Таблица рекордов:" });

    this.setupContent();
  }

  getTimeSpanText() {
    switch (this.timeSpan) {
      case TimeSpan.allTime:
        return "Все время";
      case TimeSpan.month:
        return "Месяц";
      case TimeSpan.week:
        return "Неделя";
    }
  }

  setupContent() {
    const timeSpanText = new Text(this.getTimeSpanText(), {
      ...this.leadboardOptions.timeSpan,
    });
    timeSpanText.anchor.x = 0.5;
    this.addChild(timeSpanText);
    this.timeSpanText = timeSpanText;

    this.okButton = new IconButton({
      textureNames: {
        active: "ok_button_active.png",
        hover: "ok_button_hover.png",
        press: "ok_button_press.png",
      },
    });
    this.addChild(this.okButton);
  }

  handleResize(options: ISceneResizeParams) {
    super.handleResize(options);

    const middleX = this.sprites.infoPlate.width / 2;

    this.timeSpanText.position.x = middleX;
    this.timeSpanText.position.y =
      this.sprites.headerInfoPlate.y + this.sprites.headerInfoPlate.height + this.leadboardOptions.timeSpanGap;

    this.okButton.position.x = middleX - this.okButton.width;
    this.okButton.position.y =
      this.timeSpanText.position.y + this.timeSpanText.height + this.leadboardOptions.okButtonGap;
  }
}
