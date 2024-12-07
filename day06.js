console.time("time");

const fs = require("fs");

const nextPosMods = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};
const turns = {
  "^": ">",
  v: "<",
  "<": "^",
  ">": "v",
};

const filename = "inputs/day06.txt";

const p1Grid = runPt1();
console.log(`Part 1: ${countTrodden(p1Grid)}`);

let trodden = [];
for (let i = 0; i < p1Grid.length; i++) {
  for (let j = 0; j < p1Grid[0].length; j++) {
    if (turns[p1Grid[i][j]]) {
      trodden.push([i, j]);
    }
  }
}
runPt2(trodden);

console.timeEnd("time");

function runPt1() {
  const grid = fs
    .readFileSync("inputs/day06.txt", { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.split(""));
  solve(grid);
  return grid;
}

function runPt2(trodden) {
  const grid = fs
    .readFileSync("inputs/day06.txt", { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.split(""));
  const guardPos = getGuardPos(grid);
  let count = 0;
  for (let pos of trodden) {
    if (pos[0] === guardPos[0] && pos[1] === guardPos[1]) continue;
    const copy = JSON.parse(JSON.stringify(grid));
    copy[pos[0]][pos[1]] = "#";
    const completed = solve(copy);
    if (!completed) count++;
  }
  console.log(`Part 2: ${count}`);
}

function solve(grid) {
  const guardPos = getGuardPos(grid);
  const path = {};
  while (isInGrid(grid, guardPos)) {
    if (!tick(grid, guardPos, path)) return false;
  }
  return true;
}

function getGuardPos(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "^") return [i, j];
    }
  }
}

function isInGrid(grid, pos) {
  return (
    pos[0] >= 0 &&
    pos[0] < grid.length &&
    pos[1] >= 0 &&
    pos[1] < grid[0].length
  );
}

function tick(grid, pos, path) {
  const dir = grid[pos[0]][pos[1]];
  move(grid, pos, dir);
  const pathKey = `${pos[0]}:${pos[1]}`;
  if (path[pathKey] && path[pathKey].includes(grid[pos[0]][pos[1]]))
    return false;
  try {
    path[pathKey] = path[pathKey] ? path[pathKey] : [];
    path[pathKey].push(grid[pos[0]][pos[1]]);
  } catch (err) {}
  return true;
}

function move(grid, pos, dir) {
  const nextPosMod = nextPosMods[dir];
  const nextPos = [pos[0] + nextPosMod[0], pos[1] + nextPosMod[1]];
  let hasTurned = false;
  if (isInGrid(grid, nextPos)) {
    if (grid[nextPos[0]][nextPos[1]] === "#") {
      grid[pos[0]][pos[1]] = turns[dir];
      hasTurned = true;
    } else {
      grid[nextPos[0]][nextPos[1]] = dir;
    }
  }
  if (!hasTurned) {
    pos[0] = nextPos[0];
    pos[1] = nextPos[1];
  }
}

function countTrodden(grid) {
  let count = 0;
  for (let row of grid) {
    for (let col of row) {
      if (Object.keys(turns).includes(col)) count++;
    }
  }
  return count;
}
