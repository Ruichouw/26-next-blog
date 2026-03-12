// app/blog/page.tsx
import SearchClient from "@/components/blog/search-client";
export const metadata = {
  title: "搜索",
};
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">搜索</h1>
      <div className="mt-6">
        <SearchClient initialQuery={q} />
      </div>
    </main>
  );
}
