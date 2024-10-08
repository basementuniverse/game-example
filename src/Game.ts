import { vec } from '@basementuniverse/vec';
import ContentManager, { ContentProcessor } from '@basementuniverse/content-manager';
import Debug from '@basementuniverse/debug';
import InputManager from '@basementuniverse/input-manager';
import SceneManager from '@basementuniverse/scene-manager';
import LoadingScene from './scenes/LoadingScene';
import * as config from './config.json';
import * as constants from './constants';
import { ShaderProcessor } from './content-processors/shader.content-processor';
import { textureAtlasContentProcessor } from '@basementuniverse/texture-atlas';
import { tileMapOptionsContentProcessor } from '@basementuniverse/tile-map';
import { spriteOptionsContentProcessor } from '@basementuniverse/sprite';

export default class Game {
  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  private lastFrameTime: number;

  private lastFrameCountTime: number;

  private frameRate: number = 0;

  private frameCount: number = 0;

  public static screen: vec;

  public constructor(container: HTMLElement | null) {
    if (container === null) {
      throw new Error('A valid container element must be specified.');
    }
    if (container.tagName.toLowerCase() !== 'canvas') {
      throw new Error('Container element must be a canvas.');
    }
    this.canvas = container as HTMLCanvasElement;

    // Get a 2d context
    const context = this.canvas.getContext('2d');
    if (context !== null) {
      this.context = context;
    } else {
      throw new Error("Couldn't get a 2d context.");
    }

    // Handle resize
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public initialise() {
    // Initialise subsystems
    ContentManager.initialise({
      simulateSlowLoading: constants.DEBUG,
      slowLoadingTimeMin: 100,
      slowLoadingTimeMax: 500,
      processors: {
        shader: ShaderProcessor,
        textureAtlas: textureAtlasContentProcessor as unknown as ContentProcessor,
        tileMap: tileMapOptionsContentProcessor as unknown as ContentProcessor,
        sprite: spriteOptionsContentProcessor as unknown as ContentProcessor,
      },
      throwOnNotFound: true,
    });
    Debug.initialise({
      lineMargin: 5,
    });
    InputManager.initialise();
    SceneManager.initialise();

    // Start game loop
    this.lastFrameTime = this.lastFrameCountTime = performance.now();
    this.loop();

    // Push the initial scene
    SceneManager.push(new LoadingScene());
  }

  private loop() {
    const now = performance.now();
    const elapsedTime = Math.min(now - this.lastFrameTime, constants.FPS_MIN);

    // Calculate framerate
    if (now - this.lastFrameCountTime >= 1000) {
      this.lastFrameCountTime = now;
      this.frameRate = this.frameCount;
      this.frameCount = 0;
    }
    this.frameCount++;
    this.lastFrameTime = now;
    if (config.showFPS) {
      Debug.value('FPS', this.frameRate, { align: 'right' });
      Debug.chart('FPS', this.frameRate, { minValue: 0, maxValue: 70 });
    }

    // Do game loop
    this.update(elapsedTime);
    this.draw();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  update(dt: number) {
    Game.screen = vec(this.canvas.width, this.canvas.height);

    Debug.value('status', ContentManager.status);
    Debug.value('progress', ContentManager.progress);

    SceneManager.update(dt);
    InputManager.update();  // Input manager should be updated last
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    SceneManager.draw(this.context);
  }
}
