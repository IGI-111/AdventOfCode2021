const f = await Deno.readTextFile('./2.txt');
const commands: Array<{ cmd: string; val: number }> = f
  .trim()
  .split('\n')
  .map((line) => {
    const [cmd, val] = line.split(' ');
    return { cmd, val: parseInt(val) };
  });

const pos1 = commands.reduce(
  (acc, { cmd, val }) => {
    switch (cmd) {
      case 'forward':
        acc.pos += val;
        break;
      case 'down':
        acc.depth += val;
        break;
      case 'up':
        acc.depth -= val;
        break;
    }
    return acc;
  },
  { pos: 0, depth: 0 }
);
console.log(pos1.pos * pos1.depth);

const pos2 = commands.reduce(
  (acc, { cmd, val }) => {
    switch (cmd) {
      case 'forward':
        acc.pos += val;
        acc.depth += acc.aim * val;
        break;
      case 'down':
        acc.aim += val;
        break;
      case 'up':
        acc.aim -= val;
        break;
    }
    return acc;
  },
  { pos: 0, depth: 0, aim: 0 }
);
console.log(pos2.pos * pos2.depth);
