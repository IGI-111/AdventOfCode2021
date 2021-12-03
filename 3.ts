const f = await Deno.readTextFile('./3.txt');

const numbers = f.trim().split('\n');

const oneCount = (digits: string[]): number =>
  digits.reduce((acc, d) => (d === '1' ? acc + 1 : acc), 0);

const mostCommonDigit = (numbers: string[], pos: number) =>
  oneCount(numbers.map((n) => n[pos])) >= numbers.length / 2 ? '1' : '0';
const leastCommonDigit = (numbers: string[], pos: number) =>
  oneCount(numbers.map((n) => n[pos])) < numbers.length / 2 ? '1' : '0';

const gamma = parseInt(
  [...Array(numbers[0].length)]
    .map((_, i) => mostCommonDigit(numbers, i))
    .join(''),
  2
);
const epsilon = ((1 << numbers[0].length) - 1) & ~gamma;

console.log(gamma * epsilon);

const selectWith = (numbers: string[], selector: Function) => {
  let set = numbers.slice();
  let i = 0;
  while (set.length > 1) {
    const ref = selector(set, i);
    set = set.filter((number) => ref === number[i]);
    ++i;
  }
  return parseInt(set[0], 2);
};

const o2 = selectWith(numbers, mostCommonDigit);
const co2 = selectWith(numbers, leastCommonDigit);
console.log(o2 * co2);
