import { Assets, Container, Sprite, Spritesheet, Texture } from "pixi.js";
import { Game } from "./Game";
import { SceneManager } from "../scenes/SceneManager";

export class Misc extends Sprite {
  game!: Game;
  velocity = 1;
  readyForDelete = false;
  constructor({ texture, game }: { texture: Texture; game: Game }) {
    super(texture);
    this.game = game;
  }

  handleUpdate(deltaMS: number) {
    this.position.x -= this.game.speed * this.velocity * deltaMS;
    if (this.position.x + this.width < 0) {
      this.readyForDelete = true;
    }
  }
}

export class Tree extends Misc {
  constructor({ game }: { game: Game }) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    super({
      texture: Math.random() > 0.5 ? textures["tree_1.png"] : textures["tree_2.png"],
      game,
    });
    this.scale.set(0.5);
  }
}

export class Cloud extends Misc {
  constructor({ game }: { game: Game }) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    const random = Math.random();
    super({
      texture:
        random > 0.3 ? textures["cloud_1.png"] : random > 0.6 ? textures["cloud_2.png"] : textures["airship.png"],
      game,
    });
    this.velocity = 0.1 + Math.random();
    this.scale.set(0.5);
  }
}

export class Coin extends Misc {
  isCoin = true;
  constructor({ game }: { game: Game }) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    super({
      texture: textures["coin.png"],
      game,
    });
    this.scale.set(0.5);
  }
}

export class Stopper extends Misc {
  constructor({ game }: { game: Game }) {
    const spritesheet: Spritesheet = Assets.get("spritesheet");
    const { textures } = spritesheet;
    super({
      texture: textures["stopper_idle.png"],
      game,
    });
    this.scale.set(0.5);
  }
}

export class MiscLayer extends Container {
  game!: Game;
  cloudsOrTrees!: Container<Cloud | Tree>;
  coins!: Container<Coin>;
  stoppers!: Container<Stopper>;
  treeSpawnTime = 0;
  cloudSpawnTime = 0;
  coinSpawnTime = 0;
  options = {
    treeSpawnChance: 0.3,
    treeSpawnAt: 1000,
    cloudSpawnChance: 0.4,
    cloudSpawnAt: 2000,
    cloudSpawnGapY: 400,
    coinSpawnChance: 0.2,
    coinSpawnAt: 1000,
    coinSpawnRange: 400,
  };

  constructor({ game }: { game: Game }) {
    super();
    this.game = game;

    this.cloudsOrTrees = new Container<Cloud | Tree>();
    this.addChild(this.cloudsOrTrees);

    this.coins = new Container<Coin>();
    this.addChild(this.coins);

    this.stoppers = new Container<Stopper>();
    this.addChild(this.stoppers);

    this.seed();
  }

  seed() {
    const tree = new Tree({ game: this.game });
    tree.position.x = 100;
    tree.position.y = SceneManager.height - this.game.options.groundMargin - tree.height;
    this.cloudsOrTrees.addChild(tree);

    [
      { x: 200, y: 500 },
      { x: 400, y: 600 },
    ].forEach(({ x, y }) => {
      const cloud = new Cloud({ game: this.game });
      cloud.position.x = x;
      cloud.position.y = SceneManager.height - y;
      this.cloudsOrTrees.addChild(cloud);
    });
  }

  handleUpdate(deltaMS: number) {
    if (this.treeSpawnTime > this.options.treeSpawnAt) {
      if (Math.random() > this.options.treeSpawnChance) {
        const tree = new Tree({ game: this.game });
        tree.position.x = SceneManager.width + this.width;
        tree.position.y = SceneManager.height - this.game.options.groundMargin - tree.height;
        this.cloudsOrTrees.addChild(tree);
      }
      this.treeSpawnTime = 0;
    } else {
      this.treeSpawnTime += deltaMS;
    }
    if (this.cloudSpawnTime > this.options.cloudSpawnAt) {
      if (Math.random() > this.options.cloudSpawnChance) {
        const cloud = new Cloud({ game: this.game });
        cloud.position.x = SceneManager.width + this.width;
        cloud.position.y =
          cloud.height +
          Math.random() * (SceneManager.height - this.game.options.groundMargin - this.options.cloudSpawnGapY);
        this.cloudsOrTrees.addChild(cloud);
      }
      this.cloudSpawnTime = 0;
    } else {
      this.cloudSpawnTime += deltaMS;
    }
    this.cloudsOrTrees.children.forEach((cloudOrTree) => {
      cloudOrTree.handleUpdate(deltaMS);
    });
    this.coins.children.forEach((coin) => {
      coin.handleUpdate(deltaMS);
    });
    this.stoppers.children.forEach((stopper) => {
      stopper.handleUpdate(deltaMS);
    });
    this.cleanMarkedForDeletion(this.cloudsOrTrees);
    this.cleanMarkedForDeletion(this.coins);
    this.cleanMarkedForDeletion(this.stoppers);
  }

  cleanMarkedForDeletion<T extends Misc = Misc>(container: Container<T>): void {
    for (let i = 0; i < container.children.length; i++) {
      const child: T = container.children[i];
      if (child.readyForDelete) {
        child.removeFromParent();
        i--;
      }
    }
  }
}
