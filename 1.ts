const zip = <T>(head: T[], ...tail: T[][]) =>
  head.map((k: T, i: number) => [k, ...tail.map((t) => t[i])]);

const increases = (a: number[]) =>
  zip(a.slice(0, -1), a.slice(1)).filter(([prev, cur]) => prev < cur).length;

const sliding_window = <T>(a: T[], len: number) => {
  const start = [...Array(len).keys()];
  const end = start.map((v) => -v).reverse();
  const columns = start.map((_, i) =>
    a.slice(start[i], end[i] === 0 ? undefined : end[i])
  );
  return zip(columns[0], ...columns.slice(1));
};

const sum = (a: number[]) => a.reduce((acc, v) => acc + v, 0);

const f = await Deno.readTextFile('./1.txt');
const depths = f
  .trim()
  .split('\n')
  .map((d) => parseInt(d, 10));

console.log(increases(depths));

console.log(increases(sliding_window(depths, 3).map((win) => sum(win))));
