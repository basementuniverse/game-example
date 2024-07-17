export interface Actor {
  update(dt: number): void;
  draw(context: CanvasRenderingContext2D): void;
}
