import { Howl } from "howler";
import buttonPressAudio from "../assets/audio/button_press.mp3";
import musicAudio from "../assets/audio/music.mp3";

type SoundName = "button-press" | "music";

export class GameAudio {
  buttonPress = new Howl({
    src: buttonPressAudio,
    volume: 0.5,
  });

  music = new Howl({
    src: musicAudio,
    volume: 0.5,
  });

  getSounds(name: SoundName): Howl[] {
    switch (name) {
      case "button-press":
        return [this.buttonPress];
      case "music":
        return [this.music];
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

  private play({ name, volume, stop = [] }: { name: SoundName; volume?: number; stop?: SoundName[] }): void {
    const sounds = this.getSounds(name);
    if (sounds.length > 0) {
      this.stop(stop);
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      if (volume != null && volume >= 0 && volume <= 1) {
        sound.volume(volume);
      }
      sound.play();
    }
  }

  playClick(): void {
    this.play({ name: "button-press", stop: [] });
  }

  playMusic(): void {
    this.play({ name: "music", stop: [] });
  }

  stopMusic(): void {
    this.stop(["music"]);
  }
}
