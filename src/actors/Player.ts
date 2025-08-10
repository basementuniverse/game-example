import { Sprite, SpriteOptions } from '@basementuniverse/sprite';
import { Actor } from './Actor';
import { vec2 } from '@basementuniverse/vec';
import InputManager from '@basementuniverse/input-manager';
import { clamp } from '@basementuniverse/utils';

export type PlayerDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export class Player implements Actor {
  private static readonly SPEED: number = 40;
  private static readonly DIRECTION_MAP: Record<string, PlayerDirection> = {
    ['1, 0']: 'e',
    ['1, 1']: 'se',
    ['0, 1']: 's',
    ['-1, 1']: 'sw',
    ['-1, 0']: 'w',
    ['-1, -1']: 'nw',
    ['0, -1']: 'n',
    ['1, -1']: 'ne',
  };

  private sprite: Sprite;

  public constructor(
    public position: vec2,
    public direction: PlayerDirection,
    spriteData: SpriteOptions
  ) {
    this.sprite = new Sprite({
      ...spriteData,
      position,
      defaultDirection: direction,
    });
  }

  public update(dt: number) {
    const moveVector = vec2();

    if (InputManager.keyDown('ArrowUp')) {
      moveVector.y--;
    }
    if (InputManager.keyDown('ArrowDown')) {
      moveVector.y++;
    }
    if (InputManager.keyDown('ArrowLeft')) {
      moveVector.x--;
    }
    if (InputManager.keyDown('ArrowRight')) {
      moveVector.x++;
    }

    this.position = vec2.add(
      this.position,
      vec2.mul(moveVector, Player.SPEED * dt)
    );

    this.position.x = clamp(this.position.x, 0, 1024);
    this.position.y = clamp(this.position.y, 0, 1024);

    const moving = !vec2.eq(moveVector, vec2());
    if (moving) {
      this.direction = (
        Player.DIRECTION_MAP[vec2.str(moveVector)] ?? 's'
      ) as PlayerDirection;
    }

    this.sprite.position = vec2.cpy(this.position);
    this.sprite.direction = this.direction;
    this.sprite.animation = moving ? 'walk' : 'idle';
    this.sprite.update(dt);
  }

  public draw(context: CanvasRenderingContext2D) {
    this.sprite.draw(context);
  }
}
