import { Sprite, SpriteOptions } from '@basementuniverse/sprite';
import { Actor } from './Actor';
import { vec } from '@basementuniverse/vec';
import InputManager from '@basementuniverse/input-manager';
import { clamp } from '@basementuniverse/utils';

export type PlayerDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export class Player implements Actor {
  private static readonly SPEED: number = 40;

  private sprite: Sprite;

  public constructor(
    public position: vec,
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
    const moveVector = vec();

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

    this.position = vec.add(
      this.position,
      vec.mul(moveVector, Player.SPEED * dt)
    );

    this.position.x = clamp(this.position.x, 0, 1024);
    this.position.y = clamp(this.position.y, 0, 1024);

    const moving = !vec.eq(moveVector, vec());
    if (moving) {
      this.direction = ({
        ['1, 0']: 'e',
        ['1, 1']: 'se',
        ['0, 1']: 's',
        ['-1, 1']: 'sw',
        ['-1, 0']: 'w',
        ['-1, -1']: 'nw',
        ['0, -1']: 'n',
        ['1, -1']: 'ne',
      }[vec.str(moveVector)] ?? 's') as PlayerDirection;
    }

    this.sprite.position = vec.cpy(this.position);
    this.sprite.direction = this.direction;
    this.sprite.animation = moving ? 'walk' : 'idle';
    this.sprite.update(dt);
  }

  public draw(context: CanvasRenderingContext2D) {
    this.sprite.draw(context);
  }
}
