import removeMarkdown from "remove-markdown";

export function extractPlainText(content: string, maxLength?: number): string {
  const cleaned = content
    // 去掉代码块
    .replace(/```[\s\S]*?```/g, "")
    // 去掉行内代码
    .replace(/`[^`\n]+`/g, "")
    // 去掉图片
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // 链接只保留文字
    .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1");

  const plainText = removeMarkdown(cleaned)
    .replace(/\s+/g, " ") // 多空格合并
    .trim();

  // 如果传入长度则截取
  if (maxLength && plainText.length > maxLength) {
    return plainText.slice(0, maxLength);
  }

  return plainText;
}
