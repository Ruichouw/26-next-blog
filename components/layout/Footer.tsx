// components/PostFooter.tsx
import Link from "next/link";

export default function PostFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 py-4">
      <div className="space-y-10">
        {/* 版权信息 */}
        <div className="text-center text-xs text-muted-foreground flex items-center px-16 justify-center gap-5">
          <p>
            © {new Date().getFullYear()} Ruichouw's Blog. All rights reserved.
          </p>
          <p>Built with Next.js · MDX · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
