type Rules = {
  [target: string]: string;
};
type ElemCount = { [elem: string]: number };

function elemCount(polymer: string): ElemCount {
  return polymer.split('').reduce((acc: ElemCount, c) => {
    if (acc[c] === undefined) {
      acc[c] = 0;
    }
    ++acc[c];
    return acc;
  }, {});
}

function applyStep(polymer: string, rules: Rules): string {
  const res = [];

  for (let i = 0; i < polymer.length - 1; ++i) {
    const pair = polymer.slice(i, i + 2);
    const insert = rules[pair];

    res.push(polymer[i]);
    if (insert !== undefined) {
      res.push(insert);
    }
  }
  res.push(polymer[polymer.length - 1]);
  return res.join('');
}

const f = await Deno.readTextFile('./14.txt');
const [init, rulesStr] = f.trim().split('\n\n');
const rules = rulesStr.split('\n').reduce((acc: Rules, line) => {
  const [target, insert] = line.split(' -> ');
  acc[target] = insert;
  return acc;
}, {});

let polymer = init;
for (let i = 0; i < 10; ++i) {
  polymer = applyStep(polymer, rules);
}
const counts10 = Object.values(elemCount(polymer)).sort((a, b) => a - b);
console.log(counts10[counts10.length - 1] - counts10[0]);
