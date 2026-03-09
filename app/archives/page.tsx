import ArchiveList from "@/components/blog/ArchiveList";
import { getArchives, getTotalPostsCount } from "@/lib/posts";

export default function ArchivesPage() {
  const archives = getArchives();
  const totalPosts = getTotalPostsCount();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">归档</h1>
        <p className="mt-4 text-white/60">共 {totalPosts} 篇文章</p>
      </header>

      {archives.length === 0 ? (
        <p className="mt-10 text-white/60">暂时还没有文章归档。</p>
      ) : (
        <ArchiveList archives={archives} />
      )}
    </main>
  );
}
