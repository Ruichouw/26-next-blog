import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPostsMeta, getPostBySlug } from "@/lib/posts";
import { rehypePrettyCodeOptions } from "@/lib/mdx";
import rehypePrettyCode from "rehype-pretty-code";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// 获取所有文章的 slug 以生成静态路径
export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({
    slug: post.slug,
  }));
}
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  // 根据slug获取文章
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="border-b border-black/10 pb-8">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex gap-4 items-center">
          <time className="mt-4 block text-sm text-neutral-500">
            {post.date}
          </time>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 px-3 py-1 text-sm "
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="prose prose-neutral rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 ">
        {/* MDXRemote组件负责把MDX 字符串，解析并渲染成 React 内容，remarkGfm 让你支持 GitHub 风格 Markdown */}
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
            },
          }}
        />
      </article>
    </main>
  );
}
