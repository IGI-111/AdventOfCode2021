function deduceDigitMap(patterns: string[]): {
  [pat: string]: string;
} {
  const pats = patterns.map((pat) => pat.split(''));

  const numberMap: { [num: number]: string[] } = {};
  const wireMap: { [pat: string]: string } = {};

  numberMap[1] = pats.find((pat) => pat.length === 2)!;
  numberMap[4] = pats.find((pat) => pat.length === 4)!;
  numberMap[8] = pats.find((pat) => pat.length === 7)!;
  numberMap[7] = pats.find((pat) => pat.length === 3)!;
  wireMap.A = numberMap[7].find((c) => !numberMap[1].includes(c))!;
  numberMap[9] = pats.find(
    (pat) => pat.length === 6 && numberMap[4].every((c) => pat.includes(c))
  )!;
  wireMap.E = 'abcdefg'.split('').find((c) => !numberMap[9].includes(c))!;
  wireMap.G = numberMap[9].find(
    (c) => !numberMap[4].includes(c) && c !== wireMap.A
  )!;
  numberMap[3] = pats.find(
    (pat) => pat.length === 5 && numberMap[1].every((c) => pat.includes(c))
  )!;
  wireMap.D = numberMap[3].find(
    (c) => !numberMap[1].includes(c) && c !== wireMap.A && c !== wireMap.G
  )!;
  numberMap[0] = pats.find(
    (pat) => pat.length === 6 && !pat.includes(wireMap.D)
  )!;
  numberMap[6] = pats.find(
    (pat) => pat.length === 6 && pat !== numberMap[0] && pat !== numberMap[9]
  )!;
  wireMap.C = 'abcdefg'.split('').find((c) => !numberMap[6].includes(c))!;
  wireMap.B = 'abcdefg'
    .split('')
    .find((c) => !numberMap[3].includes(c) && c !== wireMap.E)!;
  numberMap[2] = pats.find(
    (pat) => pat.length === 5 && pat !== numberMap[3] && pat.includes(wireMap.C)
  )!;
  numberMap[5] = pats.find(
    (pat) => pat.length === 5 && pat !== numberMap[3] && pat !== numberMap[2]
  )!;

  const res: {
    [pat: string]: string;
  } = {};
  for (const [num, pat] of Object.entries(numberMap)) {
    res[pat.sort().join('')] = num;
  }
  return res;
}

const f = await Deno.readTextFile('./8.txt');
const input = f
  .trim()
  .split('\n')
  .map((line) => {
    let [patterns, output] = line.split(' | ');
    return {
      output: output.split(' ').map((pat) => pat.split('').sort().join('')),
      patterns: patterns.split(' ').map((pat) => pat.split('').sort().join('')),
    };
  });

const count1487 = input.reduce(
  (acc, val) =>
    acc + val.output.filter((pat) => [2, 4, 7, 3].includes(pat.length)).length,
  0
);
console.log(count1487);

const sum = input.reduce((acc, { output, patterns }) => {
  const digitMap = deduceDigitMap(patterns);
  const num = parseInt(output.map((pat) => digitMap[pat]).join(''));
  return acc + num;
}, 0);
console.log(sum);
