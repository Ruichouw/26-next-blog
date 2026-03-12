import ArticleList from "@/components/blog/ArticleList";
import { getAllPostsMeta } from "@/lib/posts";
export const metadata = {
  title: "首页",
};
export default function HomePage() {
  const posts = getAllPostsMeta().slice(0, 5);
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <ArticleList posts={posts} />
    </main>
  );
}
