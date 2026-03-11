import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type ArticleCardProps = {
  post: PostMeta;
};

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group rounded-2xl border border-neutral-700 bg-neutral-900/60 transition hover:border-[#0F766E]">
      <Link
        href={`/posts/${post.slug}`}
        className="flex flex-col space-y-3 p-6"
      >
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-[#5EEAD4]">
          {post.title}
        </h2>

        <p className="text-base text-neutral-400 line-clamp-2">
          {post.summary}
        </p>

        <time className="text-xs text-neutral-500">{post.date}</time>
      </Link>
    </article>
  );
}
