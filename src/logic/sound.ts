import { Howl, Howler } from 'howler';
import click from '../sounds/click.ogg';

export const buttonClick = new Howl({
  src: click,
  preload: true,
  volume: 0.25,
});
