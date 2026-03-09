import GithubSlugger from "github-slugger";

export type TocItem = {
  text: string;
  id: string;
  level: number;
};

export function extractToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  const slugger = new GithubSlugger();

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "").trim();

      toc.push({
        text,
        id: slugger.slug(text),
        level: 2,
      });
    }

    if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "").trim();

      toc.push({
        text,
        id: slugger.slug(text),
        level: 3,
      });
    }
  }

  return toc;
}
