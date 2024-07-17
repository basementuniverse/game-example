import { vec } from '@basementuniverse/vec';
import Game from '../Game';
import SceneManager, {
  Scene,
  SceneTransitionState,
} from '@basementuniverse/scene-manager';
import InputManager from '@basementuniverse/input-manager';
import Camera from '@basementuniverse/camera';
import ContentManager from '@basementuniverse/content-manager';
import { TileMap, TileMapOptions } from '@basementuniverse/tile-map';
import { SpriteOptions } from '@basementuniverse/sprite';
import { Player } from '../actors';

export default class GameScene extends Scene {
  private static readonly TRANSITION_TIME: number = 1;

  private static readonly STARTING_POSITION: vec = vec(512, 512);

  private camera: Camera;

  private map: TileMap;

  private player: Player;

  public constructor() {
    super({
      transitionTime: GameScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    this.camera = new Camera(
      GameScene.STARTING_POSITION,
      {
        minScale: 0.5,
        maxScale: 5,
        bounds: {
          top: 0,
          left: 0,
          right: 1024,
          bottom: 1024,
        },
        moveEaseAmount: 0.95,
        scaleEaseAmount: 0.95,
      }
    );
    this.camera.scaleImmediate = 3;

    this.map = new TileMap(
      ContentManager.get<TileMapOptions>('tile-map-data')!
    );

    this.player = new Player(
      GameScene.STARTING_POSITION,
      's',
      ContentManager.get<SpriteOptions>('character-sprite-data')!
    );
  }

  public update(dt: number) {
    if (InputManager.keyPressed('Escape')) {
      SceneManager.pop();
    }

    if (InputManager.mouseWheelUp()) {
      this.camera.scale += 0.1;
    }
    if (InputManager.mouseWheelDown()) {
      this.camera.scale -= 0.1;
    }

    this.player.update(dt);
    this.camera.position = vec.cpy(this.player.position);
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.transitionState !== SceneTransitionState.None) {
      context.globalAlpha = this.transitionAmount;
    }

    // Background
    context.fillStyle = '#ccc';
    context.fillRect(0, 0, Game.screen.x, Game.screen.y);

    context.save();
    this.camera.draw(context, Game.screen);

    // Map
    this.map.draw(context, this.camera);

    // Player
    this.player.draw(context);

    context.restore();
    context.restore();
  }
}
