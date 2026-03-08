import ArticleList from "@/components/blog/ArticleList";
import { posts } from "@/lib/posts";
export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 ">
      <ArticleList posts={posts} />
    </main>
  );
}
