import type Fuse from "fuse.js";
import type { SearchDoc } from "./client-search";
import { FuseResult } from "fuse.js";

export function extractMatchedSnippet(
  result: FuseResult<SearchDoc>,
  radius = 45,
) {
  const textMatch = result.matches?.find((m) => m.key === "text");

  if (!textMatch || !textMatch.indices.length) {
    const fallback = result.item.summary || result.item.text.slice(0, 120);
    return {
      snippet: fallback,
      indices: [] as [number, number][],
    };
  }

  const [start, end] = textMatch.indices[0];
  const text = result.item.text;

  const snippetStart = Math.max(0, start - radius);
  const snippetEnd = Math.min(text.length, end + radius + 1);

  let snippet = text.slice(snippetStart, snippetEnd).trim();

  const prefixOffset = snippetStart;
  const snippetIndices: [number, number][] = textMatch.indices
    .filter(([s, e]) => s >= snippetStart && e <= snippetEnd)
    .map(([s, e]) => [s - prefixOffset, e - prefixOffset]);

  if (snippetStart > 0) {
    snippet = "..." + snippet;
    for (const index of snippetIndices) {
      index[0] += 3;
      index[1] += 3;
    }
  }

  if (snippetEnd < text.length) {
    snippet = snippet + "...";
  }

  return {
    snippet,
    indices: snippetIndices,
  };
}
