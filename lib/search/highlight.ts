import type Fuse from "fuse.js";

export function highlightByIndices(
  text: string,
  indices: readonly [number, number][] = [],
) {
  if (!indices.length) {
    return [{ text, hit: false }];
  }

  const merged: [number, number][] = [];

  for (const [start, end] of indices) {
    const last = merged[merged.length - 1];

    if (!last) {
      merged.push([start, end]);
      continue;
    }

    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const parts: { text: string; hit: boolean }[] = [];
  let cursor = 0;

  for (const [start, end] of merged) {
    if (cursor < start) {
      parts.push({
        text: text.slice(cursor, start),
        hit: false,
      });
    }

    parts.push({
      text: text.slice(start, end + 1),
      hit: true,
    });

    cursor = end + 1;
  }

  if (cursor < text.length) {
    parts.push({
      text: text.slice(cursor),
      hit: false,
    });
  }

  return parts;
}

export function getMatchIndices(
  matches: readonly Fuse.FuseResultMatch[] | undefined,
  key: string,
): [number, number][] {
  const found = matches?.find((m) => m.key === key);
  return (found?.indices as [number, number][]) ?? [];
}
