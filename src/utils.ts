export interface ITile {
  mine: boolean,
  flag: boolean,
  number: number | null,
  floor: number,
  egg: number | null,
  dragon: number,
}
interface INeighbor {
  row: number,
  col: number,
}
export interface IResults { tally: { [key: number]: number }, silent: boolean, perfect: boolean }
type Row = ITile[];
export type GameBoard = Row[];

export const buildBoard = (width: number, height: number): GameBoard => {
  const board: GameBoard = [];

  for (let i = 0; i < height; i++) {
    const row: Row = [];
    for (let j = 0; j < width; j++) {
      const tile: ITile = {
        mine: false,
        flag: false,
        number: null,
        floor: Math.floor(Math.random() * 3),
        egg: Math.floor(Math.random() * 3),
        dragon: Math.floor(Math.random() * 4),
      };
      row.push(tile);
    }
    board.push(row);
  }

  return board;
};

export const getValidNeighbors = (row: number, col: number, board: GameBoard): INeighbor[] => {
  const possibleNeighbors: INeighbor[] = [
    { row: row - 1, col: col - 1 }, { row: row - 1, col }, { row: row - 1, col: col + 1 },
    { row, col: col - 1 }, { row, col: col + 1 },
    { row: row + 1, col: col - 1 }, { row: row + 1, col }, { row: row + 1, col: col + 1 },
  ];

  const validNeighbors: INeighbor[] = possibleNeighbors.filter(item => item.row >= 0 && item.row < board.length
    && item.col >= 0 && item.col < board[0].length
    && board[item.row][item.col].number === null,
  );

  return validNeighbors;
};

export const placeMines = (
  row: number,
  col: number,
  width: number,
  height: number,
  minesPercentage: number,
  board: GameBoard,
) => {
  const mines: number = Math.ceil((width * height) * minesPercentage);
  let minesPlaced = 0;
  const boardWithMines: GameBoard = JSON.parse(JSON.stringify(board));

  const clickArea: INeighbor[] = getValidNeighbors(row, col, boardWithMines);
  clickArea.push({ row, col });

  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * height);
    const c = Math.floor(Math.random() * width);
    const tile: ITile = boardWithMines[r][c];
    const isValid = !clickArea.some(spot => spot.row === r && spot.col === c);

    if (isValid && !tile.mine) {
      tile.mine = true;
      minesPlaced += 1;
    }
  }

  return boardWithMines;
};

export const getWarningNumber = (row: number, col: number, board: GameBoard): number => {
  const validNeighbors: INeighbor[] = getValidNeighbors(row, col, board);
  const count: number = validNeighbors.reduce((acc, cur) => {
    const tile: ITile = board[cur.row][cur.col];
    acc = tile.mine ? acc + 1 : acc; // eslint-disable-line no-param-reassign
    return acc;
  }, 0);
  return count;
};

export const clearEmptySpace = (row: number, col: number, board: GameBoard): GameBoard => {
  let updatedBoard: GameBoard = JSON.parse(JSON.stringify(board));
  const neighbors: INeighbor[] = getValidNeighbors(row, col, updatedBoard);

  if (neighbors.length === 0) { return updatedBoard; }

  neighbors.forEach(item => {
    const warningNumber: number = getWarningNumber(item.row, item.col, updatedBoard);
    const tile: ITile = updatedBoard[item.row][item.col];
    if (!tile.flag) {
      updatedBoard[item.row][item.col].number = warningNumber;
      if (warningNumber === 0) {
        updatedBoard = clearEmptySpace(item.row, item.col, updatedBoard);
      }
    }
  });

  return updatedBoard;
};

export const countResults = (board: GameBoard, victory: boolean): IResults => {
  const listOfTiles: ITile[] = board.reduce((acc: ITile[], cur: ITile[]) => [...acc, ...cur], []);
  const gameResults = listOfTiles.reduce((acc: IResults, cur: ITile) => {
    if (cur.number !== null && cur.number > 0) {
      acc.tally[cur.number] += 1;
    }
    if (cur.mine && !cur.flag) {
      acc.perfect = false;
    }
    return acc;
  }, {
    tally: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    silent: victory,
    perfect: true,
  });

  return gameResults;
};
