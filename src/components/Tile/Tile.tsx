import type { Component } from 'solid-js';
import { createSignal, JSX } from 'solid-js';
import type { ITile } from '../../utils';
import { } from '../../utils';
import styles from './Tile.module.css';

interface ITileProps {
  tile: ITile,
  defeated: boolean,
  victorious: boolean,
  handleLeftClick: (e: Event & {
    currentTarget: HTMLButtonElement;
    target: Element;
  }) => void,
  handleRightClick: (e: Event & {
    currentTarget: HTMLButtonElement;
    target: Element;
  }) => void,
  rowIndex: number,
  colIndex: number,
}

const Tile: Component<ITileProps> = props => {
  const [hovering, setHovering] = createSignal<boolean>(false);

  const handleMouseEnter = () => {
    props.tile.number === null
    && !props.defeated
    && !props.victorious
    && setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, Event> = e => {
    setHovering(false);
    props.handleLeftClick(e);
  };

  const handleRightClick: JSX.EventHandler<HTMLButtonElement, Event> = e => {
    props.handleRightClick(e);
  };

  const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.shiftKey) {
        handleRightClick(e);
      } else {
        handleClick(e);
      }
    }
  };

  return (
    <div
      class={`
        ${styles[`floor${props.tile.floor}`]}
        ${styles[hovering() ? 'hover' : 'nohover']}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        title={`tile in row ${props.rowIndex + 1} column ${props.colIndex + 1}`}
        type="button"
        onClick={handleClick}
        onContextMenu={handleRightClick}
        class={`
          ${styles[`tile${props.tile.egg}`]}
          ${styles[props.tile.number !== null ? `open${props.tile.number}` : '']}
          ${styles[props.tile.number === null ? 'activeCursor' : '']}
          ${styles[props.defeated && props.tile.mine ? `dragon${props.tile.dragon}` : '']}
        `}
        data-row={props.rowIndex}
        data-col={props.colIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        <div class={`${styles[props.tile.flag && !props.defeated ? 'flag' : '']}`} />
      </button>
    </div>
  );
};

export default Tile;
