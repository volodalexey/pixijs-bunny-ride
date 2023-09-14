import { Howl } from "howler";
import buttonPressAudio from "../assets/audio/button_press.mp3";
import musicAudio from "../assets/audio/music.mp3";
import listShowAudio from "../assets/audio/list_show.mp3";
import snowAudio from "../assets/audio/snow.mp3";
import jumpAudio from "../assets/audio/jumper.mp3";
import gameEndAudio from "../assets/audio/game_end.mp3";

type SoundName = "button-press" | "music" | "list-show" | "snow" | "jump" | "game-end";

export class GameAudio {
  muted = true;
  buttonPress = new Howl({
    src: buttonPressAudio,
    volume: 0.5,
  });

  music = new Howl({
    src: musicAudio,
    volume: 0.5,
  });

  listShow = new Howl({
    src: listShowAudio,
    volume: 0.5,
  });

  snow = new Howl({
    src: snowAudio,
    loop: true,
    volume: 0.5,
  });

  jump = new Howl({
    src: jumpAudio,
    volume: 0.5,
  });

  gameEnd = new Howl({
    src: gameEndAudio,
  });

  getSounds(name: SoundName): Howl[] {
    switch (name) {
      case "button-press":
        return [this.buttonPress];
      case "music":
        return [this.music];
      case "list-show":
        return [this.listShow];
      case "snow":
        return [this.snow];
      case "jump":
        return [this.jump];
      case "game-end":
        return [this.gameEnd];
    }
    return [];
  }

  private stop(stop: SoundName[] = []) {
    stop
      .map((sn) => this.getSounds(sn))
      .forEach((stopSounds) => {
        stopSounds.forEach((s) => s.stop());
      });
  }

  private play({
    name,
    keep,
    volume,
    stop = [],
  }: {
    name: SoundName;
    keep?: boolean;
    volume?: number;
    stop?: SoundName[];
  }) {
    if (this.muted) {
      return;
    }
    const sounds = this.getSounds(name);
    if (sounds.length > 0) {
      this.stop(stop);
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      if (volume != null && volume >= 0 && volume <= 1) {
        sound.volume(volume);
      }
      if (keep && sound.playing()) {
        return;
      }
      sound.play();
    }
  }

  playClick() {
    this.play({ name: "button-press" });
  }

  playMusic() {
    this.play({ name: "music" });
  }

  stopMusic() {
    this.stop(["music"]);
  }

  playListShow() {
    this.play({ name: "list-show" });
  }

  playJump() {
    this.play({ name: "jump" });
  }

  playSnow() {
    this.play({ name: "snow", keep: true });
  }

  stopSnow() {
    this.stop(["snow"]);
  }

  playGameEnd() {
    this.play({ name: "game-end", stop: ["jump", "snow"] });
  }
}
