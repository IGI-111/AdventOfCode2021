function median(numbers: number[]) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}
function average(numbers: number[]) {
  return numbers.reduce((acc, x) => acc + x, 0) / numbers.length;
}

function triangularNumber(n: number) {
  return (n * n + n) / 2;
}

function totalFuel(positions: number[], alignOn: number) {
  return positions
    .map((p) => Math.abs(p - alignOn))
    .reduce((acc, x) => acc + x, 0);
}

function realTotalFuel(positions: number[], alignOn: number) {
  return positions
    .map((p) => triangularNumber(Math.abs(p - alignOn)))
    .reduce((acc, x) => acc + x, 0);
}

const f = await Deno.readTextFile('./7.txt');
const positions = f
  .trim()
  .split(',')
  .map((x) => parseInt(x));

const total = totalFuel(positions, median(positions));
console.log(total);

const avg = average(positions);
const realTotal = [Math.floor(avg), Math.ceil(avg)]
  .map((x) => realTotalFuel(positions, x))
  .reduce((acc, x) => Math.min(acc, x), Infinity);
console.log(realTotal);
