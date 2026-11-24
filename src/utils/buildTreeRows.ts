export interface ITreeRow {
  kind: "dir" | "file";
  name: string;
  path: string;
  depth: number;
}

/** Плоские пути → строки дерева: папки раньше файлов, внутри — по алфавиту */
export const buildTreeRows = (paths: string[]): ITreeRow[] => {
  const sorted = [...paths].sort((a, b) => {
    const partsA = a.split("/");
    const partsB = b.split("/");
    for (let index = 0; index < Math.min(partsA.length, partsB.length); index++) {
      if (partsA[index] === partsB[index]) continue;
      const aIsDir = index < partsA.length - 1;
      const bIsDir = index < partsB.length - 1;
      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
      return partsA[index].localeCompare(partsB[index]);
    }
    return partsA.length - partsB.length;
  });

  const rows: ITreeRow[] = [];
  const seenDirs = new Set<string>();
  for (const path of sorted) {
    const parts = path.split("/");
    parts.slice(0, -1).forEach((name, depth) => {
      const dir = parts.slice(0, depth + 1).join("/");
      if (seenDirs.has(dir)) return;
      seenDirs.add(dir);
      rows.push({ kind: "dir", name, path: dir, depth });
    });
    rows.push({ kind: "file", name: parts.at(-1)!, path, depth: parts.length - 1 });
  }
  return rows;
};
