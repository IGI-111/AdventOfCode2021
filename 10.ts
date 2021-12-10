function closing(open: string): string | undefined {
  const CLOSE: { [c: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };
  return CLOSE[open];
}

function syntaxCheck(line: string): {
  firstInvalidChar: string | null;
  closingChars: string | null;
} {
  const stack = [];
  for (const c of line) {
    if (['(', '[', '{', '<'].includes(c)) {
      stack.push(c);
    } else {
      const open = stack.pop();
      if (open === undefined || closing(open!) !== c) {
        return { firstInvalidChar: c, closingChars: null };
      }
    }
  }
  return {
    firstInvalidChar: null,
    closingChars: stack.reverse().map(closing).join(''),
  };
}

function invalidScore(lines: string[]): number {
  const SCORES: { [c: string]: number } = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };
  return lines
    .map((line) => syntaxCheck(line).firstInvalidChar)
    .filter((c) => c !== null)
    .reduce((acc, c) => SCORES[c!] + acc, 0);
}

function validScore(lines: string[]): number {
  const SCORES: { [c: string]: number } = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };

  const lineScores = lines
    .map((line) => syntaxCheck(line).closingChars)
    .filter((s) => s !== null)
    .map((closing) =>
      closing!.split('').reduce((acc, c) => acc * 5 + SCORES[c], 0)
    );
  lineScores.sort((a, b) => a - b);
  return lineScores[Math.floor(lineScores.length / 2)];
}

const f = await Deno.readTextFile('./10.txt');
const lines = f.trim().split('\n');
console.log(invalidScore(lines));
console.log(validScore(lines));
