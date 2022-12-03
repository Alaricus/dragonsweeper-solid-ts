import dialogClosed from './assets/sounds/dialog-closed.mp3';
import start from './assets/sounds/start.mp3';
import clear from './assets/sounds/clear.mp3';
import warning from './assets/sounds/warning.mp3';
import mark from './assets/sounds/mark.mp3';
import unmark from './assets/sounds/unmark.mp3';
import defeat from './assets/sounds/defeat.mp3';
import victory from './assets/sounds/victory.mp3';
import coboldCavern from './assets/sounds/cobold-cavern.mp3';

const sounds: { [key: string]: string } = {
  dialogClosed,
  start,
  clear,
  warning,
  mark,
  unmark,
  defeat,
  victory,
  coboldCavern,
};

export const playSound = (name: string | undefined, play = false) => {
  if (play && name) {
    const sfx: HTMLAudioElement = document.querySelector('.sfx') as HTMLAudioElement;
    sfx.src = `${sounds[name]}`;
    sfx.volume = 0.15;
    sfx.play();
  }
};

export const playMusic = (play: boolean) => {
  const music: HTMLAudioElement = document.querySelector('.music') as HTMLAudioElement;
  music.src = `${sounds.coboldCavern}`;
  music.volume = 0.15;
  if (play) {
    music.play();
  } else {
    music.pause();
  }
};
