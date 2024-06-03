import types from '@nuxtjs/tailwindcss';
import type { AnimatedSpritesheet } from './animated_spritesheet';
import type { Overworld } from './overworld';

type Key = { x: number, y: number };
type Keys = {[key: string]: Key};

export const keyMap = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyD: 'right',
  ArrowRight: 'right',
};

enum Direction {
  UP = 'up',
  LEFT = 'left',
  DOWN = 'down',
  RIGHT = 'right',
  None = 'none',
}

export class Controller {
  world: Overworld;
  keys: Keys = {
    up: { x: 0, y: -2},
    left: { x: -2, y: 0},
    down: { x: 0, y: 2},
    right: { x: 2, y: 0},
  }
  private direction: string = 'none'
  private nextDirection: string[] = [];
  private movingProgressRemaining: number = 0;
  private movingProgress: number = 0;
  
  constructor(world: Overworld, ...focusList: AnimatedSpritesheet[]) {
    this.world = world;
    window.addEventListener('keydown', (event) => this.keydownHandler(event), { passive: false });
    window.addEventListener('keyup', (event) => this.keyupHandler(event));
    this.world.app.ticker.add(() => this.tickerHandler());
  }

  tickerHandler() {
    if (this.nextDirection[0] !== undefined && this.movingProgressRemaining <= 0) {
      this.movingProgressRemaining = 8;
      this.direction = this.nextDirection[0];
    }
    if (this.direction !== 'none' && this.movingProgressRemaining > 0) { 
      const dire = this.keys[this.direction];
      this.world.move(dire);
      this.movingProgressRemaining -= 1;
    }
  }

  keydownHandler(event: KeyboardEvent) {
    console.log('keydown', event.code);
    if (event.repeat) return;
    const key = keyMap[event.code as keyof typeof keyMap];
    if (key &&  this.nextDirection.indexOf(key) === -1)
      this.nextDirection.unshift(key);

    // if (key) {
    //   // this.world.app.ticker.add(() => this.world.move(key));
    //   const dire = this.keys[key];
    //   while (this.movingProgressRemaining > 0) {
    //     this.world.move(dire);
    //     this.movingProgressRemaining -= 1;
    //   }
    //   this.movingProgressRemaining = 8;
    //   // this.world.move(this.keys[key]);
    // }
  }

  keyupHandler(event: KeyboardEvent) {
    console.log('keyup', event.code);
    if (this.nextDirection.length === 0) return;
    const key = keyMap[event.code as keyof typeof keyMap];
    const index = this.nextDirection.indexOf(key);
    if (index === -1) return;
    this.nextDirection.splice(index, 1);
  }

  updatePosition() {
    
  }
}