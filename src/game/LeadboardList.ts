import { Container, Text } from "pixi.js";
import { LeadboardItem } from "../utils/api";
import {
  HighleaderName1Plate,
  HighleaderName2Plate,
  HighleaderName3Plate,
  HighleaderScores1Plate,
  HighleaderScores2Plate,
  HighleaderScores3Plate,
  MidleaderNamePlate,
  MidleaderScoresPlate,
  TextInputPlate,
} from "./TextInputPlate";
import { COLOR_WHITE, FONT_FAMILY, FONT_SIZE_REGULAR } from "../utils/constants";
import { GameAudio } from "../utils/Audio";

class HighleaderLine extends Container {
  options = {
    gapBetween: 20,
    gapScoreTop: 15,
  };

  constructor({ item, place }: { item: LeadboardItem; place: 1 | 2 | 3 }) {
    super();

    let namePlate: TextInputPlate | null = null;
    let scorePlate: TextInputPlate | null = null;
    switch (place) {
      case 1:
        namePlate = new HighleaderName1Plate({ text: item.name });
        scorePlate = new HighleaderScores1Plate({ text: String(item.record) });
        break;
      case 2:
        namePlate = new HighleaderName2Plate({ text: item.name });
        scorePlate = new HighleaderScores2Plate({ text: String(item.record) });
        break;
      case 3:
        namePlate = new HighleaderName3Plate({ text: item.name });
        scorePlate = new HighleaderScores3Plate({ text: String(item.record) });
        break;
    }
    if (namePlate != null && scorePlate != null) {
      this.addChild(namePlate);
      scorePlate.position.x = namePlate.width + this.options.gapBetween;
      scorePlate.position.y = this.options.gapScoreTop;
      this.addChild(scorePlate);
    }
  }
}

class MidleaderLine extends Container {
  options = {
    gapBetween: 20,
    gapPlaceTop: 0,
  };

  constructor({ place, item }: { item: LeadboardItem; place: number }) {
    super();

    const placeText = new Text(place, {
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE_REGULAR,
      fill: COLOR_WHITE,
    });
    placeText.anchor.x = 0.5;
    placeText.position.x = this.options.gapBetween * 2;
    placeText.position.y = this.options.gapPlaceTop;
    this.addChild(placeText);

    const namePlate = new MidleaderNamePlate({ text: item.name });
    namePlate.position.x = placeText.position.x + this.options.gapBetween;
    this.addChild(namePlate);

    const scorePlate = new MidleaderScoresPlate({ text: String(item.record) });
    scorePlate.position.x = namePlate.position.x + namePlate.width + this.options.gapBetween;
    this.addChild(scorePlate);
  }
}

export interface LeadboardListOptions {
  audio: GameAudio;
}

export class LeadboardList extends Container {
  audio!: LeadboardListOptions["audio"];
  options = {
    gap: 5,
  };

  constructor(options: LeadboardListOptions) {
    super();
    this.audio = options.audio;
  }

  cleanAll() {
    while (this.children[0] != null) {
      this.children[0].removeFromParent();
    }
  }

  showData() {
    this.children.forEach((child, idx) => {
      setTimeout(
        () => {
          child.visible = true;
          this.audio.playListShow();
        },
        (idx + 1) * 50,
      );
    });
  }

  printData(data: LeadboardItem[]) {
    this.cleanAll();
    let sumY = 0;
    data.forEach((item, idx) => {
      const place = idx + 1;
      let line: Container | null = null;
      switch (place) {
        case 1:
        case 2:
        case 3:
          line = new HighleaderLine({ item, place });

          break;
        default:
          line = new MidleaderLine({ item, place });
          break;
      }
      line.visible = false;
      line.position.y = sumY;
      sumY += line.height + this.options.gap;
      this.addChild(line);
    });
    this.showData();
  }
}
