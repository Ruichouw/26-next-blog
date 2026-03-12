import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractPlainText } from "@/lib/summary";

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
// 返回处理好的所有文章数据，包含content字段
export function getAllPosts(): Post[] {
  const fileNames = getPostFileNames();

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);

    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      title: data.title,
      date: data.date,
      summary: data.summary ?? extractPlainText(content, 200),
      tags: data.tags ?? [],
      slug,
      content, // 关键
    } as Post;
  });

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
    const { data, content } = matter(fileContents);
    // 返回统一结构，而不是直接返回data，因为我们需要slug字段，而slug是从文件名生成的，不在front matter中，所以我们需要手动添加slug字段
    return {
      title: data.title,
      date: data.date,
      summary: data.summary ?? extractPlainText(content, 200),
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
    summary: data.summary ?? extractPlainText(content, 200),
    tags: data.tags ?? [],
    slug,
    content,
  };
}

export type TagCount = {
  tag: string;
  count: number;
};

// 返回含有tag和count字段的数组，tag是标签名，count是标签出现的次数
export function getAllTagsWithCount(): TagCount[] {
  const posts = getAllPostsMeta();
  // 用map统计标签数量;
  const tagMap = new Map<string, number>();

  // 遍历所有文章的标签，统计每个标签出现的次数，存储在tagMap中，key是标签名，value是出现次数
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      // 为什么用？？而不是||, 因为如果标签数量为0，||会把0当做false，导致统计错误，而??只会在undefined或null时才使用默认值，所以更适合这里的场景。
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });
  // 转换为数组，再将数组元素转换为对象，最后按数量排序，数量相同则按标签名排序
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({
      tag,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
// 返回所有标签的总数量
export function getAllTagsTotalCount(): number {
  const tags = getAllTagsWithCount();
  return tags.reduce((sum, tag) => sum + tag.count, 0);
}
// 根据标签获取文章列表
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPostsMeta();

  return posts.filter((post) => post.tags.includes(tag));
}

// 对标签进行URL编码，生成静态路径参数，因为标签可能包含特殊字符，而URL只能包含特定字符，所以需要进行编码，encodeURIComponent会把特殊字符转换为%加上对应的ASCII码的形式，这样就可以安全地在URL中使用标签了。
export function getTagSlugs(): { tag: string }[] {
  return getAllTagsWithCount().map(({ tag }) => ({
    tag: encodeURIComponent(tag),
  }));
}

export type ArchiveGroup = {
  year: string;
  posts: PostMeta[];
};

// 返回按年份分组的文章列表
export function getArchives(): ArchiveGroup[] {
  const posts = getAllPostsMeta().filter((post) => post.date);
  const archiveMap = new Map<string, PostMeta[]>();

  posts.forEach((post) => {
    const year = post.date.slice(0, 4);

    if (!archiveMap.has(year)) {
      archiveMap.set(year, []);
    }

    archiveMap.get(year)?.push(post);
  });

  return Array.from(archiveMap.entries())
    .map(([year, posts]) => ({
      year,
      posts: posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

// 返回文章总数量
export function getTotalPostsCount(): number {
  return getAllPostsMeta().length;
}
