import type { Component } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import type { IResults } from './utils';
import Controls from './components/Controls/Controls';
import Board from './components/Board/Board';
import Dialog from './components/Dialog/Dialog';
import { playMusic, playSound } from './audioPlayer';
import { readLocalStorage } from './localStorageUtils';
import styles from './App.module.css';

const App: Component = () => {
  const [boardWidth, setBoardWidth] = createSignal<number>(12);
  const [boardHeight, setBoardHeight] = createSignal<number>(8);
  const [minesPercentage, setMinesPercentage] = createSignal<number>(0.2);
  const [sound, setSound] = createSignal<boolean>(true);
  const [music, setMusic] = createSignal<boolean>(true);
  const [results, setResults] = createSignal<IResults | null>(null);

  createEffect(() => {
    const settings = readLocalStorage();
    if (settings) {
      setBoardWidth(settings.width);
      setBoardHeight(settings.height);
      setMinesPercentage(settings.minesPercentage);
      setSound(settings.sound);
      setMusic(settings.music);
    }
    playMusic(music());
  });

  const handleSound = (name: string) => {
    playSound(name, sound());
  };

  return (
    <div class={styles.app}>
      <Controls
        boardWidth={boardWidth()}
        setBoardWidth={setBoardWidth}
        boardHeight={boardHeight()}
        setBoardHeight={setBoardHeight}
        minesPercentage={minesPercentage()}
        setMinesPercentage={setMinesPercentage}
        sound={sound()}
        setSound={setSound}
        music={music()}
        setMusic={setMusic}
      />
      <Board
        width={boardWidth()}
        height={boardHeight()}
        minesPercentage={minesPercentage()}
        setResults={setResults}
        emitSound={handleSound}
      />
      <Dialog
        results={results()}
        resetResults={setResults}
        emitSound={handleSound}
      />
      <audio class="sfx" />
      <audio class="music" loop />
    </div>
  );
};
export default App;
