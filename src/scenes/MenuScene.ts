import Game from '../Game';
import SceneManager, {
  Scene,
  SceneTransitionState,
} from '@basementuniverse/scene-manager';
import { vec2 } from '@basementuniverse/vec';
import { lerp } from '@basementuniverse/utils';
import InputManager from '@basementuniverse/input-manager';
import ContentManager from '@basementuniverse/content-manager';
import GameScene from './GameScene';
import { ImageFont } from '@basementuniverse/image-font';

export default class MenuScene extends Scene {
  private static readonly TRANSITION_TIME: number = 1;

  private background: HTMLImageElement;
  private title: HTMLImageElement;
  private menuFont: ImageFont;

  public constructor() {
    super({
      transitionTime: MenuScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    const background = ContentManager.get<HTMLImageElement>('menu-background');
    if (background) {
      this.background = background;
    }

    const title = ContentManager.get<HTMLImageElement>('menu-title');
    if (title) {
      this.title = title;
    }

    const menuFont = ContentManager.get<ImageFont>('menu-font');
    if (menuFont) {
      this.menuFont = menuFont;
    }
  }

  public update(dt: number) {
    if (InputManager.keyPressed() || InputManager.mousePressed()) {
      SceneManager.push(new GameScene());
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.transitionState !== SceneTransitionState.None) {
      context.globalAlpha = this.transitionAmount;
    }

    // Background
    const largestScreenDimension = Math.max(Game.screen.x, Game.screen.y);
    const aspectRatio = this.background.width / this.background.height;
    const backgroundSize = vec2(
      largestScreenDimension * aspectRatio,
      largestScreenDimension
    );
    if (this.background) {
      context.drawImage(
        this.background,
        Game.screen.x / 2 - backgroundSize.x / 2,
        Game.screen.y / 2 - backgroundSize.y / 2,
        largestScreenDimension * aspectRatio,
        largestScreenDimension
      );
    }

    // Title
    if (this.title) {
      const y = lerp(
        -300,
        Game.screen.y / 2 - 200,
        this.transitionAmount
      );

      context.drawImage(
        this.title,
        Game.screen.x / 2 - this.title.width / 2,
        y
      );
    }

    // Menu text
    if (this.menuFont) {
      const text = 'PRESS ANY KEY TO START...';
      const y = lerp(
        Game.screen.y + 100,
        Game.screen.y / 2 + 100,
        this.transitionAmount
      );

      this.menuFont.drawText(context, text, Game.screen.x / 2, y, {
        align: 'center',
        scale: 0.7,
      });
    }

    context.restore();
  }
}
