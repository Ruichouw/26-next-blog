import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 获取content / posts目录的绝对路径，path.join是字符串拼接，process.cwd()是当前工作目录的绝对路径
const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  slug: string;
};

export type Post = PostMeta & {
  content: string;
};

// 获取content / posts目录下所有的mdx文件数组
function getPostFileNames() {
  return fs.readdirSync(postsDirectory).filter((fileName) => {
    return fileName.endsWith(".mdx");
  });
}

// 返回处理好的文章元数据
export function getAllPostsMeta(): PostMeta[] {
  const fileNames = getPostFileNames();

  // 返回文章中的元数据
  const posts = fileNames.map((fileName) => {
    // 按文件名生成slug，去掉.md后缀
    const slug = fileName.replace(/\.mdx$/, "");
    // 获取每一篇文章的完整路径
    const fullPath = path.join(postsDirectory, fileName);
    // 读取文章内容返回字符串
    const fileContents = fs.readFileSync(fullPath, "utf8");
    // 利用gray-matter解析字符串，提取出front matter中的数据和内容，返回一个对象，data是front matter中的数据，content是文章内容
    const { data } = matter(fileContents);
    // 返回统一结构，而不是直接返回data，因为我们需要slug字段，而slug是从文件名生成的，不在front matter中，所以我们需要手动添加slug字段
    return {
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags ?? [],
      slug,
    } as PostMeta;
  });
  // 对post按日期排序，最新的在前面
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
// 根据 slug 获取一篇文章
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  // 判断文章是否存在
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags ?? [],
    slug,
    content,
  };
}
