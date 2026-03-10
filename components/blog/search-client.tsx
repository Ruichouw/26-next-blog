"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type Fuse from "fuse.js";

import { getFuseInstance, type SearchDoc } from "@/lib/search/client-search";
import { extractMatchedSnippet } from "@/lib/search/snippet";
import { getMatchIndices, highlightByIndices } from "@/lib/search/highlight";

type SearchResult = {
  item: SearchDoc;
  score?: number;
  snippet: string;
  snippetIndices: [number, number][];
  matches?: readonly Fuse.FuseResultMatch[];
};

export default function SearchClient({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQueryString = useMemo(() => {
    return searchParams.toString();
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const { fuse } = await getFuseInstance();

        if (!active) return;

        if (!query.trim()) {
          setResults([]);
          setReady(true);
          return;
        }

        const raw = fuse.search(query, { limit: 20 });

        if (!active) return;

        setResults(
          raw.map((r) => {
            const { snippet, indices } = extractMatchedSnippet(r);

            return {
              item: r.item,
              score: r.score,
              snippet,
              snippetIndices: indices,
              matches: r.matches,
            };
          }),
        );
        setReady(true);
      } catch (error) {
        console.error("Search failed:", error);
        if (!active) return;
        setResults([]);
        setReady(true);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [query]);

  function updateUrl(nextValue: string) {
    const params = new URLSearchParams(currentQueryString);

    if (nextValue.trim()) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <input
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          updateUrl(value);
        }}
        placeholder="搜索标题、摘要、标签、正文..."
        className="w-full rounded-xl border px-4 py-3 outline-none"
      />

      {!ready ? (
        <div className="text-sm text-neutral-500">加载搜索索引中...</div>
      ) : !query.trim() ? null : results.length === 0 ? (
        <div className="rounded-2xl border p-6 text-neutral-500">
          没有找到相关文章
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const titleParts = highlightByIndices(
              result.item.title,
              getMatchIndices(result.matches, "title"),
            );

            const summaryParts = highlightByIndices(
              result.item.summary,
              getMatchIndices(result.matches, "summary"),
            );

            const snippetParts = highlightByIndices(
              result.snippet,
              result.snippetIndices,
            );

            return (
              <article key={result.item.id} className="rounded-2xl border p-5">
                <Link href={`/posts/${result.item.slug}`}>
                  <div className="text-xl font-semibold">
                    {titleParts.map((part, index) =>
                      part.hit ? (
                        <mark key={index}>{part.text}</mark>
                      ) : (
                        <span key={index}>{part.text}</span>
                      ),
                    )}
                  </div>

                  {result.item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.item.tags.map((tag, tagIndex) => {
                        const tagMatch = result.matches?.find(
                          (m) => m.key === "tags" && m.value === tag,
                        );

                        const tagParts = highlightByIndices(
                          tag,
                          (tagMatch?.indices as [number, number][]) ?? [],
                        );

                        return (
                          <span
                            key={`${tag}-${tagIndex}`}
                            className="rounded-full border px-2 py-1 text-xs text-neutral-600"
                          >
                            {tagParts.map((part, index) =>
                              part.hit ? (
                                <mark key={index}>{part.text}</mark>
                              ) : (
                                <span key={index}>{part.text}</span>
                              ),
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {result.item.summary ? (
                    <p className="mt-3 text-sm text-neutral-500">
                      {summaryParts.map((part, index) =>
                        part.hit ? (
                          <mark key={index}>{part.text}</mark>
                        ) : (
                          <span key={index}>{part.text}</span>
                        ),
                      )}
                    </p>
                  ) : null}

                  <p className="mt-3 text-neutral-700">
                    {snippetParts.map((part, index) =>
                      part.hit ? (
                        <mark key={index}>{part.text}</mark>
                      ) : (
                        <span key={index}>{part.text}</span>
                      ),
                    )}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
