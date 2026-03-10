import GithubSlugger from "github-slugger";

export type TocItem = {
  text: string;
  id: string;
  level: number;
};

// 对标题进行处理，提取出二级和三级标题，并生成对应的目录项。每个目录项包含标题文本、生成的 ID 和标题级别。
export function extractToc(content: string): TocItem[] {
  // 将字符串按行分割成数组
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  // GithubSlugger是一个库，将标题转换为url id
  const slugger = new GithubSlugger();

  for (const rawLine of lines) {
    // trim() 作用：去掉字符串 首尾空格
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      // 匹配到二级标题，去掉 "## " 前缀和空格
      const text = line.replace(/^##\s+/, "").trim();
      // 返回二级标题的目录数组
      toc.push({
        text,
        id: slugger.slug(text),
        level: 2,
      });
    }

    if (line.startsWith("### ")) {
      // 匹配到三级标题，去掉 "### " 前缀和空格
      const text = line.replace(/^###\s+/, "").trim();
      // 返回三级标题的目录数组
      toc.push({
        text,
        id: slugger.slug(text),
        level: 3,
      });
    }
  }

  return toc;
}
