import { notFound } from "next/navigation";
import { getAllTagsWithCount, getPostsByTag } from "@/lib/posts";
import TagPostList from "@/components/blog/TagPostList";

type TagDetailPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export function generateStaticParams() {
  return getAllTagsWithCount().map(({ tag }) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          #{decodedTag}
        </h1>
        <p className="mt-4 text-white/60">共 {posts.length} 篇文章</p>
      </header>

      <TagPostList posts={posts} />
    </main>
  );
}
