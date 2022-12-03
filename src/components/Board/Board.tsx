import type { Component, Setter } from 'solid-js';
import { createSignal, createEffect, JSX, For, Show } from 'solid-js';
import Tile from '../Tile/Tile';
import type { GameBoard, ITile, IResults } from '../../utils';
import { buildBoard, placeMines, getWarningNumber, clearEmptySpace, countResults } from '../../utils';
import styles from './Board.module.css';

interface IBoardProps {
  width: number,
  height: number,
  minesPercentage: number,
  setResults: Setter<IResults | null>,
  emitSound: (name: string) => void,
}

const Board: Component<IBoardProps> = props => {
  const [board, setBoard] = createSignal<GameBoard>([]);
  const [firstMove, setFirstMove] = createSignal<boolean>(true);
  const [flagged, setFlagged] = createSignal<number>(0);
  const [defeated, setDefeated] = createSignal<boolean>(false);
  const [victorious, setVictorious] = createSignal<boolean>(false);
  const [boardWidth, setBoardWidth] = createSignal<number>(0);
  const [oldWidth, setOldWidth] = createSignal<number>(0);
  const [oldHeight, setOldHeight] = createSignal<number>(0);
  const [oldPercentage, setOldPercentage] = createSignal<number>(0);

  const startGame = () => {
    setFirstMove(true);
    setFlagged(0);
    setDefeated(false);
    setVictorious(false);
    props.setResults(null);
    setBoardWidth(0);
    const newBoard = buildBoard(props.width, props.height);
    setBoard(newBoard);
    const horizontalTiles = props.width;
    const tileSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('--tile-size').slice(0, -2), 10);
    setBoardWidth(horizontalTiles * tileSize + 4); // 4 is border width times 2
    setOldWidth(props.width);
    setOldHeight(props.height);
    setOldPercentage(props.minesPercentage);
    props.emitSound('start');
  };

  createEffect(() => {
    if (
      props.minesPercentage !== oldPercentage()
     || props.width !== oldWidth()
     || props.height !== oldHeight()
    ) {
      startGame();
    }
  });

  const checkVictoryCondition = (gameBoard: GameBoard) => {
    const flat = gameBoard.reduce((acc, cur) => [...acc, ...cur], []);
    const won = flat.every(item => item.number !== null || item.mine);
    if (won) {
      props.emitSound('victory');
      setVictorious(true);
      props.setResults(countResults(gameBoard, true));
    }
  };

  const handleDefeat = (gameBoard: GameBoard) => {
    props.emitSound('defeat');
    setDefeated(true);
    props.setResults(countResults(gameBoard, false));
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, Event> = e => {
    const row = parseInt(String(e.currentTarget.dataset.row), 10);
    const col = parseInt(String(e.currentTarget.dataset.col), 10);

    const tile: ITile = board()[row][col];
    if (tile.flag) { return; }

    if (firstMove()) {
      const boardWithMines: GameBoard = placeMines(row, col, props.width, props.height, props.minesPercentage, board());
      setBoard(boardWithMines);
      setFirstMove(false);
    }

    if (!defeated() && !victorious()) {
      if (tile.mine) {
        handleDefeat(board());
        return;
      }

      const warningNumber: number = getWarningNumber(row, col, board());
      setBoard(board().map((r, rIndex) => {
        if (rIndex === row) {
          return r.map((c, cIndex) => {
            if (cIndex === col) {
              return { ...c, number: warningNumber };
            }

            return c;
          });
        }
        return r;
      }));

      if (warningNumber === 0) {
        props.emitSound('clear');
        const boardWithSpaceCleared: GameBoard = clearEmptySpace(row, col, board());
        setBoard(boardWithSpaceCleared);
      }
      warningNumber > 0 && props.emitSound('warning');

      checkVictoryCondition(board());
    }
  };

  const handleRightClick: JSX.EventHandler<HTMLButtonElement, Event> = e => {
    e.preventDefault();

    if (!defeated() && !victorious()) {
      const row = parseInt(String(e.currentTarget.dataset.row), 10);
      const col = parseInt(String(e.currentTarget.dataset.col), 10);

      setBoard(board().map((r, rIndex) => {
        if (rIndex === row) {
          return r.map((c, cIndex) => {
            if (cIndex === col && c.number === null) {
              if (c.flag) {
                setFlagged(flagged() - 1);
                props.emitSound('mark');
              } else {
                setFlagged(flagged() + 1);
                props.emitSound('unmark');
              }
              return { ...c, flag: !c.flag };
            }
            return c;
          });
        }
        return r;
      }));
    }
  };

  return (
    <>
      <Show
        when={!victorious() && !defeated()}
        fallback={<button type="button" class={styles.restart} onClick={startGame}>Play Again</button>}
      >
        <p class={styles.egginfo}>
          {`${flagged()} ${flagged() === 1 ? 'egg' : 'eggs'} marked out of ${Math.ceil(
            (props.width * props.height) * props.minesPercentage)
          } live ones`}
        </p>
      </Show>
      <div class={styles.board} style={{ 'max-width': `${boardWidth()}px` }}>
        <For each={board()}>
          {
            (row, rowIndex) => (
              <div class={styles.row}>
                <For each={row}>
                  {
                    (tile, colIndex) => (
                      <Tile
                        tile={tile}
                        defeated={defeated()}
                        victorious={victorious()}
                        handleLeftClick={handleClick}
                        handleRightClick={handleRightClick}
                        rowIndex={rowIndex()}
                        colIndex={colIndex()}
                      />
                    )
                  }
                </For>
              </div>
            )
          }
        </For>
      </div>
    </>
  );
};

export default Board;
