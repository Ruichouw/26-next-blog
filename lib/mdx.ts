import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// 配置 MDX 的代码高亮插件 rehype-pretty-code
export const rehypePrettyCodeOptions = {
  theme: "github-dark-dimmed",
  // 不要保留主题默认背景色
  keepBackground: false,
  // 如果代码块没有指定语言，默认使用什么语言
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
} satisfies Options;

export const rehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  [rehypePrettyCode, rehypePrettyCodeOptions],
];
