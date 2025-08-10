import Game from '../Game';
import SceneManager, {
  Scene,
  SceneTransitionState,
} from '@basementuniverse/scene-manager';
import InputManager from '@basementuniverse/input-manager';
import MenuScene from './MenuScene';
import ContentManager from '@basementuniverse/content-manager';
import { ShaderCanvas } from 'shader-canvas';
import Debug from '@basementuniverse/debug';

export default class IntroScene extends Scene {
  private static readonly TRANSITION_TIME: number = 2;

  private static readonly COOLDOWN_TIME: number = 8;

  private shader: ShaderCanvas;

  private logo: HTMLImageElement;

  private time: number = 0;

  public constructor() {
    super({
      transitionTime: IntroScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    const shader = ContentManager.get<ShaderCanvas>('blur-shader');
    if (shader) {
      this.shader = shader;
    }

    const logo = ContentManager.get<HTMLImageElement>('basement-universe');
    if (logo) {
      this.logo = logo;

      this.shader.setSize(this.logo.width, this.logo.height);
      this.shader.setTexture('u_mainTex', this.logo);
      this.shader.setUniform('u_resolution', this.shader.getResolution());
    }
  }

  public update(dt: number) {
    this.time += dt;

    if (
      this.time > IntroScene.COOLDOWN_TIME ||
      InputManager.keyPressed() ||
      InputManager.mousePressed()
    ) {
      SceneManager.pop();
      SceneManager.push(new MenuScene());
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.transitionState !== SceneTransitionState.None) {
      context.globalAlpha = this.transitionAmount;
    }

    if (this.shader) {
      this.shader.setUniform('u_sigma', 1 - this.transitionAmount);
      this.shader.render();
      context.drawImage(
        this.shader.domElement,
        Game.screen.x / 2 - this.logo.width / 2,
        Game.screen.y / 2 - this.logo.height / 2,
        this.logo.width,
        this.logo.height
      );
    }

    Debug.draw(context);

    context.restore();
  }
}
