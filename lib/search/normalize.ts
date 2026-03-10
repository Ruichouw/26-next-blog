// 去掉：code block，HTML tag，Markdown 符号，多余空白
export function normalizeSearchText(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*~_\-\n\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
