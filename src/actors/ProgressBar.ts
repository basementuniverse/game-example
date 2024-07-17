import { vec } from '@basementuniverse/vec';
import { Actor } from '.';

export class ProgressBar implements Actor {
  private static readonly EASE_AMOUNT = 1.5;

  private static readonly COLOUR = 'white';

  public progress: number = 0;

  private displayProgress: number = 0;

  public constructor(
    public position: vec,
    public size: vec
  ) {}

  public update(dt: number) {
    this.displayProgress += (
      this.progress - this.displayProgress
    ) * ProgressBar.EASE_AMOUNT * dt;

    if (Math.abs(this.displayProgress - this.progress) <= 0.001) {
      this.displayProgress = this.progress;
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();

    context.strokeStyle = ProgressBar.COLOUR;
    context.fillStyle = ProgressBar.COLOUR;
    context.lineWidth = 2;

    const topLeft = vec.sub(
      this.position,
      vec.mul(this.size, 1 / 2)
    );

    context.strokeRect(
      topLeft.x,
      topLeft.y,
      this.size.x,
      this.size.y
    );
    context.fillRect(
      topLeft.x,
      topLeft.y,
      Math.floor(this.displayProgress * this.size.x),
      this.size.y
    );

    context.restore();
  }
}
