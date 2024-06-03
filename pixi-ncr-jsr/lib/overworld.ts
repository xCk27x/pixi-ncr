import { Application, Assets, Sprite, Texture, Container, Spritesheet, AnimatedSprite } from 'pixi.js';
import { AnimatedSpritesheet } from './animated_spritesheet';

class Overworld {
  app!: Application;
  canvas_height: number;
  canvas_width: number;
  lowerMapSprite: Sprite | undefined;
  upperMapSprite: Sprite | undefined;
  characters: AnimatedSpritesheet[] = [];
  private canvas_id: string;
  private mapContainer!: Container;
  private focusContainer!: Container;


  constructor(id: string = 'canvas-container', height: number = 198, width: number = 352) {
    this.canvas_id = id;
    this.canvas_height = height;
    this.canvas_width = width;
    this.canvasInit();
  }

  async canvasInit() {
    const app = new Application();
    this.app = app;
    await app.init({width: this.canvas_width, height: this.canvas_height, backgroundColor: 0xffffff});
    const canvasContainer = document.getElementById(this.canvas_id);
    if (canvasContainer) {
      const canvasEntity = app.canvas;
      canvasEntity.classList.add('canvas-entity');
      canvasContainer.appendChild(canvasEntity);
    } else {
      console.error('Canvas container not found');
      return;
    }
    this.mapContainer = new Container();
    this.focusContainer = new Container();
    app.stage.addChild(this.mapContainer, this.focusContainer);
    console.log('Canvas initialized');
  }

  async loadLowerMap(lowerMap: string) {
    const texture = await Assets.load(lowerMap);
    this.lowerMapSprite = Sprite.from(texture);
    this.lowerMapSprite.anchor.set(0.5);
    this.lowerMapSprite.position.set(this.canvas_width / 2, this.canvas_height / 2);
    this.mapContainer?.addChild(this.lowerMapSprite);
    console.log('Lower map loaded');
    return this.lowerMapSprite;
  }
  
  async loadUpperMap(upperMap: string) {
    const texture = await Assets.load(upperMap);
    this.upperMapSprite = Sprite.from(texture);
    this.upperMapSprite.anchor.set(0.5);
    this.upperMapSprite.position.set(this.canvas_width / 2, this.canvas_height / 2);
    this.mapContainer.addChild(this.upperMapSprite);
    console.log('Upper map loaded');
    return this.upperMapSprite;
  }

  async loadSprite(sprite: string, focus: boolean = false) {      
    return fetch(sprite)
    .then(response => response.json())
    .then(async jsonObject => {
      const animSprShe = new AnimatedSpritesheet(sprite, jsonObject);
      await animSprShe.loadAnimSpriteSheet(this.canvas_width / 2, this.canvas_height / 2);
      if (animSprShe.anim) {
        if (focus) {
          this.focusContainer.addChild(animSprShe.anim);
        } else {
          this.mapContainer.addChild(animSprShe.anim);
        }
        console.log('Sprite loaded');
      }
      return animSprShe;
    })
  }

  move(key: {x: number, y: number}) {
    this.mapContainer.x -= key.x;
    this.mapContainer.y -= key.y;
  }
}

export { Overworld };

