import { vec2 } from '@basementuniverse/vec';
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
import Debug from '@basementuniverse/debug';

export default class GameScene extends Scene {
  private static readonly TRANSITION_TIME: number = 1;
  private static readonly STARTING_POSITION: vec2 = vec2(512, 512);

  private camera: Camera;
  private map: TileMap;
  private player: Player;

  public constructor() {
    super({
      transitionTime: GameScene.TRANSITION_TIME,
      onTransitionedOut: () => {
        Debug.removeChart('Camera Scale');
        Debug.removeChart('Wave');
      },
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
      ContentManager.get<TileMapOptions>('tile-map')!
    );

    this.player = new Player(
      GameScene.STARTING_POSITION,
      's',
      ContentManager.get<SpriteOptions>('character-sprite')!
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

    Debug.chart(
      'Camera Scale',
      this.camera.scale,
      {
        minValue: 0.5,
        maxValue: 5,
        barColours: [
          {
            offset: 1,
            colour: '#f00',
          },
          {
            offset: 2.5,
            colour: '#f50',
          },
          {
            offset: 4,
            colour: '#f90',
          },
        ]
      }
    );

    Debug.chart(
      'Wave',
      Math.sin(performance.now() / 1000) + 1,
      {
        minValue: 0,
        maxValue: 2,
        valueBufferSize: 1500,
        valueBufferStride: 30,
      }
    );

    Debug.border(
      'test1',
      '',
      vec2(200),
      {
        space: 'screen',
        size: vec2(200, 200),
        borderColour: '#f82',
        borderStyle: 'dashed',
        borderWidth: 4,
      }
    );

    Debug.border(
      'test2',
      '',
      vec2(100),
      {
        space: 'world',
        radius: 200,
        borderShape: 'circle',
        borderColour: '#5f5',
        borderStyle: 'dotted',
        showLabel: false,
      }
    );

    Debug.marker(
      'player',
      vec2.str(vec2.map(this.player.position, Math.floor)),
      vec2.add(this.player.position, vec2(0, 30)),
      {
        markerStyle: 'x',
        markerColour: '#ff0',
        showLabel: false,
        showValue: true,
      }
    );

    this.player.update(dt);
    this.camera.position = vec2.cpy(this.player.position);
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

    Debug.draw(context);

    context.restore();
    context.restore();
  }
}
