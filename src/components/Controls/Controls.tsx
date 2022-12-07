import type { Component, Setter } from 'solid-js';
import { JSX } from 'solid-js';
import { writeToLocalStorage } from '../../localStorageUtils';
import styles from './Controls.module.css';

interface IControlsProps {
  boardWidth: number,
  setBoardWidth: Setter<number>,
  boardHeight: number,
  setBoardHeight: Setter<number>,
  minesPercentage: number,
  setMinesPercentage: Setter<number>
  sound: boolean
  setSound: Setter<boolean>
  music: boolean
  setMusic: Setter<boolean>
}

const Controls: Component<IControlsProps> = props => {
  const handleWidthChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const updatedValue = parseInt(e.currentTarget.value, 10);
    props.setBoardWidth(updatedValue);
    writeToLocalStorage({
      width: updatedValue,
      height: props.boardHeight,
      minesPercentage: props.minesPercentage,
      sound: props.sound,
      music: props.music,
    });
  };

  const handleHeightChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const updatedValue = parseInt(e.currentTarget.value, 10);
    props.setBoardHeight(updatedValue);
    writeToLocalStorage({
      width: props.boardWidth,
      height: updatedValue,
      minesPercentage: props.minesPercentage,
      sound: props.sound,
      music: props.music,
    });
  };

  const handlePercentageChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const updatedValue = parseInt(e.currentTarget.value, 10) * 0.01;
    props.setMinesPercentage(updatedValue);
    writeToLocalStorage({
      width: props.boardWidth,
      height: props.boardHeight,
      minesPercentage: updatedValue,
      sound: props.sound,
      music: props.music,
    });
  };

  const handleSoundChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const updatedValue = e.currentTarget.checked;
    writeToLocalStorage({
      width: props.boardWidth,
      height: props.boardHeight,
      minesPercentage: props.minesPercentage,
      sound: updatedValue,
      music: props.music,
    });
    props.setSound(updatedValue);
  };

  const handleMusicChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const updatedValue = e.currentTarget.checked;
    writeToLocalStorage({
      width: props.boardWidth,
      height: props.boardHeight,
      minesPercentage: props.minesPercentage,
      sound: props.sound,
      music: updatedValue,
    });
    props.setMusic(updatedValue);
  };

  return (
    <div class={styles.controls}>
      <div class={styles.control}>
        <label for="width">width</label>
        <input id="width" type="range" min="4" max="16" value={props.boardWidth} onChange={handleWidthChange} />
        <label for="width">{props.boardWidth}</label>
      </div>
      <div class={styles.control}>
        <label for="height">height</label>
        <input id="height" type="range" min="4" max="10" value={props.boardHeight} onChange={handleHeightChange} />
        <label for="height">{props.boardHeight}</label>
      </div>
      <div class={styles.control}>
        <label for="percent">mines</label>
        <input
          id="percent"
          type="range" min="5" max="40" value={props.minesPercentage * 100} onChange={handlePercentageChange} />
        <label for="percent">{Math.trunc(props.minesPercentage * 100).toString()}%</label>
      </div>
      <div class={styles.control}>
        <label for="sound">sound</label>
        <input id="sound" type="checkbox" checked={props.sound} onChange={handleSoundChange} />
      </div>
      <div class={styles.control}>
        <label for="music">music</label>
        <input id="music" type="checkbox" checked={props.music} onChange={handleMusicChange} />
      </div>
    </div>
  );
};
export default Controls;
