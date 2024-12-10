console.time("time");

const fs = require("fs");

const map = fs
  .readFileSync("inputs/day10.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row) => row.split("").map((col) => Number(col)));

let total = 0;
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if (map[row][col] === 0) {
      total += ninesReachable([row, col]);
    }
  }
}
console.log(`Part 1: ${total}`);

total = 0;
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if (map[row][col] === 0) {
      const memo = {};
      total += uniqueTrails(row, col, memo);
    }
  }
}
console.log(`Part 2: ${total}`);

function ninesReachable(start) {
  const discovered = new Set();
  const queue = [start];
  while (queue.length > 0) {
    const pos = queue.pop();
    const [row, col] = pos;
    const val = map[row][col];
    if (val === 9) discovered.add(`${row}:${col}`);
    // up
    if (isOnMap(row - 1, col) && map[row - 1][col] === val + 1)
      queue.push([row - 1, col]);
    // down
    if (isOnMap(row + 1, col) && map[row + 1][col] === val + 1)
      queue.push([row + 1, col]);
    // left
    if (isOnMap(row, col - 1) && map[row][col - 1] === val + 1)
      queue.push([row, col - 1]);
    // right
    if (isOnMap(row, col + 1) && map[row][col + 1] === val + 1)
      queue.push([row, col + 1]);
  }
  return discovered.size;
}

function uniqueTrails(row, col, memo) {
  const val = map[row][col];
  if (val === 9) return 1;

  const memoKey = getMemoKey(row, col);
  const memoVal = memo[memoKey];
  if (memoVal) return memoVal;

  let total = 0;
  // up
  if (isOnMap(row - 1, col) && map[row - 1][col] === val + 1)
    total += uniqueTrails(row - 1, col, memo);
  // down
  if (isOnMap(row + 1, col) && map[row + 1][col] === val + 1)
    total += uniqueTrails(row + 1, col, memo);
  // left
  if (isOnMap(row, col - 1) && map[row][col - 1] === val + 1)
    total += uniqueTrails(row, col - 1, memo);
  // right
  if (isOnMap(row, col + 1) && map[row][col + 1] === val + 1)
    total += uniqueTrails(row, col + 1, memo);

  memo[memoKey] = total;
  return total;
}

function isOnMap(row, col) {
  return row >= 0 && row < map.length && col >= 0 && col < map[0].length;
}

function getMemoKey(row, col) {
  return `${row}:${col}`;
}

console.timeEnd("time");
