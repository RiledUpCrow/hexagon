import { Howl, Howler } from 'howler';
import click from '../sounds/click.ogg';

Howler.mobileAutoEnable = true;

export const buttonClick = new Howl({
  src: click,
  preload: true,
  volume: 0.25,
});
