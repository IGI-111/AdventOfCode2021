type Graph = { [node: string]: string[] };

function isSmall(node: string): boolean {
  return node.toUpperCase() !== node && node !== 'start' && node != 'end';
}

function hasDuplicates(arr: string[]): boolean {
  const set = new Set(arr);
  return set.size < arr.length;
}

function buildPaths(graph: Graph): string[][] {
  const buildPathsRec = (visited: string[]): string[][] => {
    const start = visited[visited.length - 1];
    if (start === 'end') {
      return [visited];
    }
    return graph[start]
      .filter((n) => n !== 'start' && !(isSmall(n) && visited.includes(n)))
      .map((n) => buildPathsRec([...visited, n]))
      .reduce((acc, paths) => acc.concat(paths), []);
  };
  return buildPathsRec(['start']);
}

function buildPaths2(graph: Graph): string[][] {
  const buildPathsRec = (visited: string[]): string[][] => {
    const start = visited[visited.length - 1];
    if (start === 'end') {
      return [visited];
    }
    return graph[start]
      .filter(
        (n) =>
          n !== 'start' &&
          !(
            isSmall(n) &&
            visited.includes(n) &&
            hasDuplicates(visited.filter(isSmall))
          )
      )
      .map((n) => buildPathsRec([...visited, n]))
      .reduce((acc, paths) => acc.concat(paths), []);
  };
  return buildPathsRec(['start']);
}

const f = await Deno.readTextFile('./12.txt');
const graph: Graph = f
  .trim()
  .split('\n')
  .map((line) => line.split('-'))
  .reduce((acc: Graph, [from, to]) => {
    if (acc[from] === undefined) {
      acc[from] = [];
    }
    if (acc[to] === undefined) {
      acc[to] = [];
    }
    acc[from].push(to);
    acc[to].push(from);
    return acc;
  }, {});
console.log(buildPaths(graph).length);
console.log(buildPaths2(graph).length);
