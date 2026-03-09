import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type TagPostListProps = {
  posts: PostMeta[];
};

export default function TagPostList({ posts }: TagPostListProps) {
  return (
    <section className="mt-10">
      <div className="divide-y divide-white/10 border-y border-white/10">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group grid grid-cols-[1fr_auto] items-center gap-6 px-4 py-4 transition-colors duration-200 hover:bg-white/[0.02]"
          >
            <h2 className="text-base text-[#d6d6d6]  underline-offset-4 group-hover:text-[#5EEAD4] hover:underline">
              {post.title}
            </h2>

            <time className="shrink-0 text-sm text-white/60">{post.date}</time>
          </Link>
        ))}
      </div>
    </section>
  );
}
