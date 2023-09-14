import { type Game } from "./Game";
import { HeroAnimation } from "./Hero";

export enum EHeroState {
  STANDING = "STANDING",
  RUNNING = "RUNNING",
  JUMPING = "JUMPING",
  FALLING = "FALLING",
}

interface IHeroStateOptions {
  game: Game;
  state: EHeroState;
}

export class HeroState {
  public game!: Game;
  public state!: EHeroState;
  constructor({ game, state }: IHeroStateOptions) {
    this.state = state;
    this.game = game;
  }

  enter(): void {
    throw new Error("enter() not implemented in child class");
  }

  handleInput(): void {
    throw new Error("handleInput() not implemented in child class");
  }
}

interface IHeroStateChildOptions {
  game: Game;
}

export class Running extends HeroState {
  constructor({ game }: IHeroStateChildOptions) {
    super({ game, state: EHeroState.RUNNING });
  }

  enter(): void {
    const { hero } = this.game;
    hero.switchAnimation(HeroAnimation.run);
  }

  handleInput(): void {
    const { inputHandler, hero } = this.game;
    if (inputHandler.hasDirectionUp()) {
      hero.setState(EHeroState.JUMPING);
    }
  }
}

export class Jumping extends HeroState {
  constructor({ game }: IHeroStateChildOptions) {
    super({ game, state: EHeroState.JUMPING });
  }

  enter(): void {
    const { hero } = this.game;
    if (hero.isOnGround()) {
      hero.jump();
    }
    hero.switchAnimation(HeroAnimation.jump);
  }

  handleInput(): void {
    const { hero } = this.game;
    if (hero.isFalling()) {
      hero.setState(EHeroState.FALLING);
    } else if (hero.isOnGround()) {
      hero.setState(EHeroState.RUNNING);
    }
  }
}

export class Falling extends HeroState {
  constructor({ game }: IHeroStateChildOptions) {
    super({ game, state: EHeroState.FALLING });
  }

  enter(): void {
    const { hero } = this.game;
    hero.switchAnimation(HeroAnimation.fall);
  }

  handleInput(): void {
    const { hero } = this.game;
    if (hero.isOnGround()) {
      hero.setState(EHeroState.RUNNING);
    }
  }
}
