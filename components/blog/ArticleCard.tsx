import Link from "next/link";
import type { Post } from "@/lib/posts";

type ArticleCardProps = {
  post: Post;
};

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 transition hover:border-[#0F766E]">
      <Link
        href={`/posts/${post.slug}`}
        className="flex flex-col space-y-3 p-6"
      >
        <h2 className="line-clamp-1 text-xl font-semibold tracking-tight group-hover:text-[#5EEAD4]">
          {post.title}
        </h2>

        <p className="text-sm text-neutral-400 line-clamp-2">{post.summary}</p>

        <time className="text-xs text-neutral-500">{post.date}</time>
      </Link>
    </article>
  );
}
