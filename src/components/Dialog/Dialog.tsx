import type { Component, Setter } from 'solid-js';
import { createEffect, Show, For } from 'solid-js';
import type { IResults } from '../../utils';
import styles from './Dialog.module.css';

import line from '../../assets/images/line.png';
import gem1 from '../../assets/images/open1.png';
import gem2 from '../../assets/images/open2.png';
import gem3 from '../../assets/images/open3.png';
import gem4 from '../../assets/images/open4.png';
import gem5 from '../../assets/images/open5.png';
import gem6 from '../../assets/images/open6.png';
import gem7 from '../../assets/images/open7.png';
import gem8 from '../../assets/images/open8.png';
import dragon from '../../assets/images/dragon1.png';
import marked from '../../assets/images/marked.png';

const icons: { [key: number | string]: string } = {
  1: gem1,
  2: gem2,
  3: gem3,
  4: gem4,
  5: gem5,
  6: gem6,
  7: gem7,
  8: gem8,
  dragon,
  marked,
};

interface IDialogProps {
  results: IResults | null,
  resetResults: Setter<IResults | null>
  emitSound: (name: string) => void,
}

const Dialog: Component<IDialogProps> = props => {
  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.results) {
      dialogRef?.showModal();
    }
  });

  const dismiss = () => {
    props.emitSound('dialogClosed');
    props.resetResults(null);
    dialogRef?.close();
  };

  return (
    <dialog ref={dialogRef} class={styles.dialog}>
      <Show when={props.results} fallback={<p>error</p>}>
        <h2>{`Endgame Report: ${props.results?.silent ? 'Victory' : 'Defeat'}`}</h2>
        <img alt="line" src={line} />
        <For each={Object.keys(props.results?.tally as Record<string, unknown>)}>
          {
            (gem: string) => (
              <div class={styles.loot}>
                <div class={styles.gem}>
                  <img
                    src={icons[gem]}
                    alt={`gem${gem}`}
                    style={{ filter: `grayscale(${props.results?.tally[parseInt(gem, 10)] === 0 ? '100' : '0'}%)` }}
                  />
                </div>
                <p class={styles.result}>
                  {` x ${props.results?.tally[parseInt(gem, 10)]}`}
                </p>
              </div>
            )
          }
        </For>
        <div>
          <div class={styles.loot}>
            <div class={styles.gem}>
              <img
                src={icons.dragon}
                alt="silent"
                style={{ filter: `grayscale(${!props.results?.silent ? '100' : '0'}%)` }}
              />
            </div>
            <p class={styles.result}>
              { props.results?.silent ? 'eggs didn\'t hatch' : 'dragons hatched' }
            </p>
          </div>
          <div class={styles.loot}>
            <div class={styles.gem}>
              <img
                src={icons.marked}
                alt="perfect"
                style={{ filter: `grayscale(${!props.results?.perfect ? '100' : '0'}%)` }}
              />
            </div>
              <p class={styles.result}>
              { props.results?.perfect ? 'all eggs marked' : 'not every living egg was marked' }
            </p>
          </div>
        </div>
        <button type="button" onClick={dismiss}>Very Well</button>
      </Show>
    </dialog>
  );
};
export default Dialog;
