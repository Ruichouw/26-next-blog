"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "首页", href: "/" },
  { label: "归档", href: "/archives" },
  { label: "标签", href: "/tags" },
  { label: "关于我", href: "/about" },
  { label: "搜索", href: "/search" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-800 bg-black backdrop-blur">
      <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-6 text-lg">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Ruichouw's Blog
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "font-medium text-[#5EEAD4]"
                    : " hover:text-emerald-200 transition-colors"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
