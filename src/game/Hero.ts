import { AnimatedSprite, Assets, Container, Graphics, Rectangle, Spritesheet } from "pixi.js";
import { type HeroState, EHeroState, Running, Jumping, Falling } from "./HeroStates";
import { type Game } from "./Game";
import { logHeroState } from "../utils/logger";
import { GameAudio } from "../utils/Audio";

export interface IHeroOptions {
  game: Game;
  audio: GameAudio;
}

export enum HeroAnimation {
  fall = "fall",
  jump = "jump",
  run = "run",
  stand = "stand",
}

export class Hero extends Container {
  moveSpeed = 1;
  jumpSpeed = 28;
  weight = 1;

  velocity = {
    vx: 0,
    vy: 0,
  };

  collisionBoxWidth = 110;
  collisionBoxHeight = 110;

  game!: IHeroOptions["game"];
  audio!: IHeroOptions["audio"];
  states!: Record<EHeroState, HeroState>;
  currentState!: HeroState;
  fallAnimation!: AnimatedSprite;
  jumpAnimation!: AnimatedSprite;
  runAnimation!: AnimatedSprite;
  standAnimation!: AnimatedSprite;
  currentAnimation!: AnimatedSprite;
  spritesContainer!: Container<AnimatedSprite>;
  collisionBox!: Graphics;

  constructor(options: IHeroOptions) {
    super();
    this.game = options.game;
    this.audio = options.audio;
    this.setup();

    this.states = {
      [EHeroState.STANDING]: new Running({ game: options.game }),
      [EHeroState.RUNNING]: new Running({ game: options.game }),
      [EHeroState.JUMPING]: new Jumping({ game: options.game }),
      [EHeroState.FALLING]: new Falling({ game: options.game }),
    };
    this.currentState = this.states.STANDING;
  }

  setup() {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;

    const spritesContainer = new Container<AnimatedSprite>();
    this.addChild(spritesContainer);
    this.spritesContainer = spritesContainer;

    const fallAnimation = new AnimatedSprite([textures["mi_bunny_idle_03.png"]]);
    spritesContainer.addChild(fallAnimation);
    this.fallAnimation = fallAnimation;

    const jumpAnimation = new AnimatedSprite([textures["mi_bunny_idle_03.png"]]);
    spritesContainer.addChild(jumpAnimation);
    this.jumpAnimation = jumpAnimation;

    const runAnimation = new AnimatedSprite([textures["mi_bunny_idle_03.png"]]);
    spritesContainer.addChild(runAnimation);
    this.runAnimation = runAnimation;

    const standAnimation = new AnimatedSprite([textures["mi_bunny_idle_03.png"]]);
    spritesContainer.addChild(standAnimation);
    this.standAnimation = standAnimation;

    this.spritesContainer.scale.set(0.3);

    const collisionBox = new Graphics();
    collisionBox.position.set(
      this.width / 2 - this.collisionBoxWidth / 2,
      this.height / 2 - this.collisionBoxHeight / 2,
    );
    collisionBox.beginFill(0xffffff, 0);
    collisionBox.drawRect(0, 0, this.collisionBoxWidth, this.collisionBoxHeight);
    collisionBox.endFill();
    this.addChild(collisionBox);
    this.collisionBox = collisionBox;
  }

  hideAllAnimations(): void {
    this.spritesContainer.children.forEach((spr) => {
      spr.visible = false;
    });
  }

  switchAnimation(animation: HeroAnimation): void {
    this.hideAllAnimations();
    switch (animation) {
      case HeroAnimation.fall:
        this.currentAnimation = this.fallAnimation;
        break;
      case HeroAnimation.jump:
        this.currentAnimation = this.jumpAnimation;
        break;
      case HeroAnimation.run:
        this.currentAnimation = this.runAnimation;
        break;
      case HeroAnimation.stand:
        this.currentAnimation = this.standAnimation;
        break;
    }
    this.currentAnimation.currentFrame = 0;
    this.currentAnimation.visible = true;
  }

  setState(state: EHeroState): void {
    this.currentState = this.states[state];
    this.currentState.enter();
    logHeroState(`state=${state}`);
  }

  jump(): void {
    this.audio.playJump();
    this.audio.stopSnow();
    this.velocity.vy = -this.jumpSpeed;
  }

  isOnGround(): boolean {
    return this.position.y + this.collisionBox.position.y >= this.game.getLevelBottom(this.collisionBoxHeight);
  }

  isFalling(): boolean {
    return this.velocity.vy > this.weight;
  }

  reset(): void {
    this.velocity.vx = 0;
    this.velocity.vy = 0;
  }

  getCollisionBounds(): Rectangle {
    const bounds = this.getBounds();
    return new Rectangle(
      bounds.x + this.collisionBox.x,
      bounds.y + this.collisionBox.y,
      this.collisionBoxWidth,
      this.collisionBoxHeight,
    );
  }

  handleUpdate(deltaMS: number): void {
    this.checkCollision();
    this.currentState.handleInput();

    const { inputHandler } = this.game;
    // HORIZONTAL MOVEMENT
    this.x += this.velocity.vx;
    if (inputHandler.hasDirectionLeft()) {
      this.velocity.vx = -this.moveSpeed * deltaMS;
    } else if (inputHandler.hasDirectionRight()) {
      this.velocity.vx = this.moveSpeed * deltaMS;
    } else {
      this.velocity.vx = 0;
    }
    let heroBounds = this.getCollisionBounds();
    if (heroBounds.x < 0) {
      this.x = 0 - this.collisionBox.position.x;
    } else if (heroBounds.x > this.game.getLevelRight(heroBounds.width)) {
      this.x = this.game.getLevelRight(heroBounds.width) - this.collisionBox.position.x;
    }

    // VERTICAL MOVEMENTw
    this.y += this.velocity.vy;
    if (!this.isOnGround()) {
      this.velocity.vy += this.weight;
    } else {
      this.audio.playSnow();
      this.velocity.vy = 0;
    }

    heroBounds = this.getCollisionBounds();
    if (heroBounds.y > this.game.getLevelBottom(heroBounds.height)) {
      this.y = this.game.getLevelBottom(heroBounds.height) - this.collisionBox.position.y;
    }
  }

  restart(): void {
    this.position.set(0, 0);
    this.velocity.vx = 0;
    this.velocity.vy = 0;
    this.setState(EHeroState.STANDING);
  }

  checkCollision(): void {
    const heroBounds = this.getCollisionBounds();
    this.game.background.miscLayer.stoppers.children.forEach((stopper) => {
      const stopperBounds = stopper.getBounds();
      if (
        stopperBounds.x < heroBounds.x + heroBounds.width &&
        stopperBounds.x + stopperBounds.width > heroBounds.x &&
        stopperBounds.y < heroBounds.y + heroBounds.height &&
        stopperBounds.y + stopperBounds.height > heroBounds.y
      ) {
        this.game.checkEndGame();
      }
    });
  }
}
