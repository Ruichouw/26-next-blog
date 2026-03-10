// scripts/build-search-index.ts
import fs from "node:fs";
import path from "node:path";
import Fuse from "fuse.js";
import { getAllPosts } from "@/lib/posts";
import { normalizeSearchText } from "../lib/search/normalize";

type SearchDoc = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  text: string;
};

const outDir = path.join(process.cwd(), "public", "search");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const posts = getAllPosts();

  const docs: SearchDoc[] = posts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    tags: post.tags ?? [],
    text: normalizeSearchText(post.content),
  }));

  ensureDir(outDir);

  fs.writeFileSync(path.join(outDir, "search-docs.json"), JSON.stringify(docs));

  const keys = [
    { name: "title", weight: 3 },
    { name: "summary", weight: 2 },
    { name: "tags", weight: 2 },
    { name: "text", weight: 1 },
  ];

  const index = Fuse.createIndex(keys, docs);

  fs.writeFileSync(
    path.join(outDir, "fuse-index.json"),
    JSON.stringify(index.toJSON()),
  );

  console.log("Search index generated.");
}

main();
