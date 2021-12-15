type Rules = {
  [target: string]: string;
};
type ElemCount = { [elem: string]: number };
type PairCount = { [pair: string]: number };

function score(elemCount: ElemCount): number {
  const counts = Object.values(elemCount).sort((a, b) => a - b);
  return counts[counts.length - 1] - counts[0];
}

function countElems(
  pairCount: PairCount,
  firstElem: string,
  lastElem: string
): ElemCount {
  const elemCount: ElemCount = {};
  for (const pair in pairCount) {
    [pair[0], pair[1]].forEach((elem) => {
      if (elemCount[elem] === undefined) {
        elemCount[elem] = 0;
      }
      elemCount[elem] += pairCount[pair];
    });
  }
  elemCount[firstElem] += 1;
  elemCount[lastElem] += 1;
  for (const elem in elemCount) {
    elemCount[elem] /= 2;
  }
  return elemCount;
}

function countPairs(polymer: string): PairCount {
  let pairCount: PairCount = {};
  for (let i = 0; i < polymer.length - 1; ++i) {
    if (pairCount[polymer.slice(i, i + 2)] === undefined) {
      pairCount[polymer.slice(i, i + 2)] = 0;
    }
    ++pairCount[polymer.slice(i, i + 2)];
  }
  return pairCount;
}

function applySteps(steps: number, polymer: string, rules: Rules): ElemCount {
  let pairCount = countPairs(polymer);
  for (let i = 0; i < steps; ++i) {
    const newPairCount: PairCount = {};
    for (const pair in pairCount) {
      const insert = rules[pair];
      if (insert !== undefined) {
        const newPair1 = pair[0] + insert;
        const newPair2 = insert + pair[1];

        if (newPairCount[newPair1] === undefined) {
          newPairCount[newPair1] = 0;
        }
        newPairCount[newPair1] += pairCount[pair];

        if (newPairCount[newPair2] === undefined) {
          newPairCount[newPair2] = 0;
        }
        newPairCount[newPair2] += pairCount[pair];
      } else {
        if (newPairCount[pair] === undefined) {
          newPairCount[pair] = 0;
        }
        newPairCount[pair] += pairCount[pair];
      }
    }
    pairCount = newPairCount;
  }

  return countElems(pairCount, polymer[0], polymer[polymer.length - 1]);
}

const f = await Deno.readTextFile('./14.txt');
const [init, rulesStr] = f.trim().split('\n\n');
const rules = rulesStr.split('\n').reduce((acc: Rules, line) => {
  const [target, insert] = line.split(' -> ');
  acc[target] = insert;
  return acc;
}, {});

console.log(score(applySteps(10, init, rules)));
console.log(score(applySteps(40, init, rules)));
