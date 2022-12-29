import { vec } from '@basementuniverse/vec';
import Game from './Game';
import SceneManager, { Scene, SceneTransitionState } from '@basementuniverse/scene-manager';
import InputManager from '@basementuniverse/input-manager';
import Camera from '@basementuniverse/camera';
import ContentManager from '@basementuniverse/content-manager';

export class GameScene extends Scene {
  private static readonly TRANSITION_TIME: number = 1;

  private camera: Camera;

  public constructor() {
    super({
      transitionTime: GameScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    this.camera = new Camera(vec());
  }

  public update(dt: number) {
    if (InputManager.keyPressed('Escape')) {
      SceneManager.pop();
    }
    if (InputManager.keyDown('ArrowUp')) {
      this.camera.position.y -= 100 * dt;
    }
    if (InputManager.keyDown('ArrowDown')) {
      this.camera.position.y += 100 * dt
    }
    if (InputManager.keyDown('ArrowLeft')) {
      this.camera.position.x -= 100 * dt
    }
    if (InputManager.keyDown('ArrowRight')) {
      this.camera.position.x += 100 * dt
    }
    if (InputManager.mouseWheelUp()) {
      this.camera.scale += 0.1;
    }
    if (InputManager.mouseWheelDown()) {
      this.camera.scale -= 0.1;
    }
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
    this.camera.draw(context, Game.screen.x, Game.screen.y);

    const image = ContentManager.get<HTMLImageElement>('basementuniverse');
    if (image) {
      context.drawImage(image, 100, 100);
    }

    context.restore();
    context.restore();
  }
}
