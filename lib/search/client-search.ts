import Fuse from "fuse.js";

export type SearchDoc = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  text: string;
};

let cachedFuse: Fuse<SearchDoc> | null = null;
let cachedDocs: SearchDoc[] | null = null;

export async function getFuseInstance() {
  if (cachedFuse && cachedDocs) {
    return { fuse: cachedFuse, docs: cachedDocs };
  }

  const [docsRes, indexRes] = await Promise.all([
    fetch("/search/search-docs.json"),
    fetch("/search/fuse-index.json"),
  ]);

  const docs: SearchDoc[] = await docsRes.json();
  const serializedIndex = await indexRes.json();

  const options: Fuse.IFuseOptions<SearchDoc> = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "title", weight: 3 },
      { name: "summary", weight: 2 },
      { name: "tags", weight: 2 },
      { name: "text", weight: 1 },
    ],
  };

  const parsedIndex = Fuse.parseIndex<SearchDoc>(serializedIndex);

  cachedFuse = new Fuse(docs, options, parsedIndex);
  cachedDocs = docs;

  return { fuse: cachedFuse, docs };
}
