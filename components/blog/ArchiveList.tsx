import Link from "next/link";
import type { ArchiveGroup } from "@/lib/posts";

type ArchiveListProps = {
  archives: ArchiveGroup[];
};

export default function ArchiveList({ archives }: ArchiveListProps) {
  return (
    <section className="mt-12 space-y-12">
      {archives.map((group) => (
        <section key={group.year}>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {group.year}
          </h2>

          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {group.posts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 px-4 py-4 transition-colors duration-200 hover:bg-white/[0.02]"
              >
                <time className="text-sm text-white/50">
                  {post.date.slice(5)}
                </time>

                <h3 className="truncate text-base text-white underline-offset-4 hover:underline hover:text-[#5EEAD4]">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
