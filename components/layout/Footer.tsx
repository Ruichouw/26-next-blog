// components/PostFooter.tsx
import Link from "next/link";

export default function PostFooter() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-neutral-950 py-8">
      <div className="space-y-10">
        {/* 版权信息 */}
        <div className="flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground md:flex-row md:gap-5 md:px-16">
          <p>
            © {new Date().getFullYear()} Ruichouw's Blog. All rights reserved.
          </p>
          <p>Built with Next.js · MDX · Tailwind CSS</p>
          {/* 备案号 */}
          <Link
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            粤ICP备2025511917号
          </Link>
        </div>
      </div>
    </footer>
  );
}
