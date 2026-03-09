import Link from "next/link";
import { getAllTagsWithCount, getAllTagsTotalCount } from "@/lib/posts";

export default function TagsPage() {
  const tags = getAllTagsWithCount();
  const totalCount = getAllTagsTotalCount();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">标签</h1>
        <p className="mt-4 text-white/60">共 {totalCount} 篇</p>
      </header>

      <section className="mt-10">
        {tags.length === 0 ? (
          <p className="text-white/60">暂时还没有标签。</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((item) => (
              <Link
                key={item.tag}
                href={`/tags/${encodeURIComponent(item.tag)}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition-colors duration-200 hover:border-white/20 hover:text-white"
              >
                {item.tag}
                <span className="ml-2 text-white/40">{item.count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
