import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";

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
  // 先检查缓存里有没有已经创建好的 Fuse 实例和文档数据，如果有，就直接返回它们，避免重复加载和构建索引的开销
  if (cachedFuse && cachedDocs) {
    return { fuse: cachedFuse, docs: cachedDocs };
  }
  // 并行加载文档数据和索引数据，减少等待时间
  const [docsRes, indexRes] = await Promise.all([
    fetch("/search/search-docs.json"),
    fetch("/search/fuse-index.json"),
  ]);
  // 把响应体解析为 JSON 数据，得到文档数组和索引对象
  const docs: SearchDoc[] = await docsRes.json();
  const serializedIndex = await indexRes.json();
  // 配置搜索规则
  const options: IFuseOptions<SearchDoc> = {
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
  // 解析索引，把 JSON 索引恢复成 Fuse 能识别的格式
  const parsedIndex = Fuse.parseIndex<SearchDoc>(serializedIndex);
  // 构造fuse实例，三个参数，docs：要搜索的数据，options：搜索规则，parsedIndex：预先构建好的索引
  cachedFuse = new Fuse(docs, options, parsedIndex);
  cachedDocs = docs;

  return { fuse: cachedFuse, docs };
}
