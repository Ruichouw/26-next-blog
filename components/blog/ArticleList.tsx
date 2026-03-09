import ArticleCard from "@/components/blog/ArticleCard";
import type { PostMeta } from "@/lib/posts";

type ArticleListProps = {
  posts: PostMeta[];
};

export default function ArticleList({ posts }: ArticleListProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">最新文章</h2>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
