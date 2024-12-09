console.time("time");

const fs = require("fs");

const filepath = "inputs/day09.txt";
const dm = fs.readFileSync(filepath, { encoding: "utf-8" });

function makeDrep(dm) {
  const drep = [];
  for (let i = 0; i < dm.length; i += 2) {
    const id = Math.floor(i / 2);
    const fileLen = Number(dm[i]);
    let last = false;
    let spaceLen = -1;
    try {
      spaceLen = Number(dm[i + 1]);
    } catch (err) {
      last = true;
    }
    for (let j = 0; j < fileLen; j++) {
      drep.push(id);
    }
    if (!last) {
      for (let j = 0; j < spaceLen; j++) {
        drep.push(".");
      }
    }
  }
  return drep;
}

let drep = makeDrep(dm);

let emptyPtr = 0;
let endPtr = drep.length - 1;
while (true) {
  while (emptyPtr <= endPtr && drep[emptyPtr] !== ".") {
    emptyPtr++;
  }

  if (emptyPtr < endPtr) {
    drep[emptyPtr] = drep[endPtr];
    drep[endPtr] = ".";
  } else {
    break;
  }

  while (endPtr > 0 && drep[endPtr] === ".") {
    endPtr--;
  }
}

const compacted = drep.filter((e) => e !== ".");
let checksum = 0;
for (let i = 0; i < compacted.length; i++) {
  checksum += i * compacted[i];
}
console.log(`Part 1: ${checksum}`);

drep = makeDrep(dm);
const freeSpaces = [];
const files = [];
let lastEntry = drep[0];
let lastStart = 0;
for (let i = 1; i < drep.length; i++) {
  const curr = drep[i];
  if (curr !== lastEntry) {
    const info = { start: lastStart, len: i - lastStart };
    if (lastEntry === ".") {
      freeSpaces.push(info);
    } else {
      files.push(info);
    }
    lastStart = i;
    lastEntry = curr;
  }
}
const finalInfo = { start: lastStart, len: drep.length - lastStart };
files.push(finalInfo);

for (let i = files.length - 1; i >= 0; i--) {
  const file = files[i];
  for (const freeSpace of freeSpaces) {
    if (freeSpace.len < file.len) continue;
    else {
      // write file to empty space
      for (let j = freeSpace.start; j < freeSpace.start + file.len; j++) {
        drep[j] = i;
      }
      // update free space
      freeSpace.start += file.len;
      freeSpace.len -= file.len;
      // write free space where file was
      for (let j = file.start; j < file.start + file.len; j++) {
        drep[j] = ".";
      }
      break;
    }
  }
}

checksum = 0;
for (let i = 0; i < drep.length; i++) {
  if (drep[i] !== '.') {
    checksum += i * drep[i];
  }
}
console.log(`Part 2: ${checksum}`);

console.timeEnd("time");
