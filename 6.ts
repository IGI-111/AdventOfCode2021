function nextStep(counts: number[]): number[] {
  return [
    counts[1],
    counts[2],
    counts[3],
    counts[4],
    counts[5],
    counts[6],
    counts[7] + counts[0],
    counts[8],
    counts[0],
  ];
}

function totalAtStep(init: number[], step: number): number {
  let counts = init;
  for (let i = 0; i < step; ++i) {
    counts = nextStep(counts);
  }
  return counts.reduce((acc, x) => acc + x, 0);
}

const f = await Deno.readTextFile('./6.txt');

const fish = f
  .trim()
  .split(',')
  .map((x) => parseInt(x));

let counts = fish.reduce((acc, counter) => {
  ++acc[counter];
  return acc;
}, Array(9).fill(0));

console.log(totalAtStep(counts, 80));
console.log(totalAtStep(counts, 256));
