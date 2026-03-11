import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import type { PluggableList } from "unified";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";

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
// rehypeSlug; // 这个插件会给所有标题元素（如 h1、h2、h3 等）添加 id 属性，值是根据标题文本生成的 slug，这样我们就可以通过这些 id 来实现目录的跳转和高亮了。
// rehypePrettyCode; // 这个插件负责对代码块进行语法高亮，rehypePrettyCodeOptions 是它的配置项，我们在上面定义了主题、是否保留背景色以及默认语言等选项。
export const rehypePlugins: PluggableList = [
  rehypeSlug,
  // [rehypeAutolinkHeadings, { behavior: "wrap" }],
  [rehypePrettyCode, rehypePrettyCodeOptions],
];
