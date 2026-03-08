export type Post = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  tags: string[];
};

export const posts: Post[] = [
  {
    title: "使用 Next.js 构建个人技术博客",
    slug: "build-blog-with-nextjs",
    date: "2026-03-09",
    summary:
      "从项目初始化、路由设计到文章系统搭建，梳理一个适合个人开发者的纯前端博客方案。从项目初始化、路由设计到文章系统搭建，梳理一个适合个人开发者的纯前端博客方案。从项目初始化、路由设计到文章系统搭建，梳理一个适合个人开发者的纯前端博客方案。",
    tags: ["Next.js", "博客", "前端"],
  },
  {
    title: "为什么我选择 MDX 作为博客内容方案",
    slug: "why-i-choose-mdx",
    date: "2026-03-06",
    summary:
      "相比传统 Markdown，MDX 在组件复用、代码示例展示和内容扩展上更适合技术博客。",
    tags: ["MDX", "内容系统"],
  },
  {
    title: "如何设计一个简洁但好用的文章卡片",
    slug: "design-clean-article-card",
    date: "2026-03-03",
    summary:
      "文章卡片不需要复杂封面，保留标题、摘要和时间，反而更适合强调内容本身。",
    tags: ["UI", "设计"],
  },
  {
    title: "静态博客中的搜索功能应该怎么做",
    slug: "search-in-static-blog",
    date: "2026-02-28",
    summary:
      "对个人博客来说，本地索引加前端模糊搜索通常已经足够，不必一开始就引入后端服务。",
    tags: ["搜索", "Fuse.js"],
  },
];
