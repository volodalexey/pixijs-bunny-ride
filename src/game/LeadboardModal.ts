import { Text, TextStyle } from "pixi.js";
import { ISceneResizeParams } from "../scenes/IScene";
import { Modal, ModalOptions } from "./Modal";
import { COLOR_BLUE, COLOR_ORANGE, FONT_FAMILY, FONT_SIZE_XXL } from "../utils/constants";
import { IconButton } from "./Button";
import { LeadboardItem } from "../utils/api";
import { LeadboardList } from "./LeadboardList";
import { GameAudio } from "../utils/Audio";
import { Resize } from "../utils/Resize";

export interface LeadboardModalOptions extends Omit<ModalOptions, "title"> {
  audio: GameAudio;
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
  loadingText!: Text;
  prevButton!: IconButton;
  nextButton!: IconButton;
  okButton!: IconButton;
  promiseAbort?: AbortController;
  promise?: Promise<void>;
  leadboardData: LeadboardItem[] = [];
  leadboardList!: LeadboardList;
  initialWidth = -1;
  initialHeight = -1;

  leadboardOptions = {
    timeSpanGap: 10,
    timeButtonGap: 50,
    okButtonGap: 20,
    leadboardListTopGap: 20,
    leadboardListLeftGap: 25,
    loading: <Pick<TextStyle, "fontFamily" | "fontSize" | "fill" | "letterSpacing" | "align">>{
      align: "center",
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_XXL,
      fill: COLOR_BLUE,
      letterSpacing: 5,
    },
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
    super({ ...options, width: 500, title: "Таблица рекордов:" });

    this.setupContent(options);
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

  cycleTimeSpan(increment = true) {
    let nextTimeSpan: TimeSpan | undefined;
    if (increment) {
      switch (this.timeSpan) {
        case TimeSpan.allTime:
          nextTimeSpan = TimeSpan.month;
          break;
        case TimeSpan.month:
          nextTimeSpan = TimeSpan.week;
          break;
        case TimeSpan.week:
          nextTimeSpan = TimeSpan.allTime;
          break;
      }
    } else {
      switch (this.timeSpan) {
        case TimeSpan.allTime:
          nextTimeSpan = TimeSpan.week;
          break;
        case TimeSpan.month:
          nextTimeSpan = TimeSpan.allTime;
          break;
        case TimeSpan.week:
          nextTimeSpan = TimeSpan.month;
          break;
      }
    }
    if (nextTimeSpan != null) {
      this.timeSpan = nextTimeSpan;
      this.timeSpanText.text = this.getTimeSpanText();
      this.loadTimeSpanData();
    }
  }

  loadTimeSpanData() {
    let loadUrl = "";
    switch (this.timeSpan) {
      case TimeSpan.allTime:
        loadUrl = "alltime.json";
        break;
      case TimeSpan.month:
        loadUrl = "month.json";
        break;
      case TimeSpan.week:
        loadUrl = "week.json";
        break;
    }

    if (this.promiseAbort) {
      this.promiseAbort.abort();
    }
    this.promiseAbort = new AbortController();
    this.loadingText.visible = true;
    this.leadboardList.visible = false;
    this.promise = fetch(`assets/leaderboard/${loadUrl}`, { signal: this.promiseAbort.signal })
      .then((res) => res.json())
      .then((data) => {
        this.leadboardData = data;
        this.leadboardList.printData(this.leadboardData);
        this.leadboardList.visible = true;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.loadingText.visible = false;
      });
  }

  setupContent({ audio }: LeadboardModalOptions) {
    const timeSpanText = new Text(this.getTimeSpanText(), {
      ...this.leadboardOptions.timeSpan,
    });
    timeSpanText.anchor.x = 0.5;
    this.addChild(timeSpanText);
    this.timeSpanText = timeSpanText;

    const loadingText = new Text("Загрузка...", {
      ...this.leadboardOptions.loading,
    });
    loadingText.anchor.x = 0.5;
    this.addChild(loadingText);
    this.loadingText = loadingText;

    this.prevButton = new IconButton({
      flip: true,
      textureNames: {
        active: "arrow_btn_active.png",
        hover: "arrow_btn_hover.png",
        press: "arrow_btn_press.png",
      },
    });
    this.addChild(this.prevButton);
    this.prevButton.on("pointerdown", () => this.cycleTimeSpan(false));

    this.nextButton = new IconButton({
      textureNames: {
        active: "arrow_btn_active.png",
        hover: "arrow_btn_hover.png",
        press: "arrow_btn_press.png",
      },
    });
    this.addChild(this.nextButton);
    this.nextButton.on("pointerdown", () => this.cycleTimeSpan(true));

    this.leadboardList = new LeadboardList({ audio });
    this.addChild(this.leadboardList);

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

    this.loadingText.position.x = middleX;
    this.loadingText.position.y = this.sprites.infoPlate.height / 2;

    this.timeSpanText.position.x = middleX;
    this.timeSpanText.position.y =
      this.sprites.headerInfoPlate.y + this.sprites.headerInfoPlate.height + this.leadboardOptions.timeSpanGap;

    this.prevButton.position.x = this.leadboardOptions.timeButtonGap;
    this.nextButton.position.x =
      this.sprites.infoPlate.width - this.leadboardOptions.timeButtonGap - this.nextButton.width;
    this.prevButton.position.y = this.nextButton.position.y = this.timeSpanText.position.y;

    this.leadboardList.position.x = this.leadboardOptions.leadboardListLeftGap;
    this.leadboardList.position.y =
      this.timeSpanText.position.y + this.timeSpanText.height + this.leadboardOptions.leadboardListTopGap;

    this.okButton.position.x = middleX - this.okButton.width / 2;
    this.okButton.position.y = this.sprites.infoPlate.height - this.okButton.height - this.leadboardOptions.okButtonGap;

    if (this.initialWidth === -1) {
      this.initialWidth = this.width;
    }
    if (this.initialHeight === -1) {
      this.initialHeight = this.height;
    }
    Resize.handleResize({
      view: this,
      availableWidth: options.viewWidth,
      availableHeight: options.viewHeight,
      contentWidth: this.initialWidth,
      contentHeight: this.initialHeight,
    });
  }
}
