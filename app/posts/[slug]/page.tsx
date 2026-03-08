import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
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

      <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 md:p-8">
        {post.content
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </article>
    </main>
  );
}
