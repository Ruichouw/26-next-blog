"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import CloseIcon from "@/components/icons/CloseIcon";

const navItems = [
  { label: "首页", href: "/" },
  { label: "归档", href: "/archives" },
  { label: "标签", href: "/tags" },
  { label: "关于我", href: "/about" },
  { label: "搜索", href: "/search" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="border-b border-neutral-800 bg-black">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white"
          >
            Ruichouw's Blog
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "font-medium text-[#5EEAD4]"
                      : "text-neutral-200 transition-colors hover:text-emerald-200"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile button */}
          <button
            type="button"
            aria-label="打开菜单"
            className="text-2xl text-white md:hidden"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* 遮罩 */}
        <div
          className={`absolute inset-0 bg-neutral-950/70 backdrop-blur transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* 左侧菜单面板 */}
        <aside
          className={`absolute left-0 top-0 h-full w-[72%] max-w-[320px] rounded-tr-2xl rounded-br-2xl border-r border-neutral-800 bg-neutral-950/90 px-6 py-8 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-lg font-semibold text-neutral-400">菜单</span>
            <button
              type="button"
              aria-label="关闭菜单"
              onClick={() => setOpen(false)}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg transition-colors ${
                    isActive
                      ? "font-medium text-[#5EEAD4]"
                      : "text-neutral-200 hover:text-emerald-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
