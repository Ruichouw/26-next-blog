"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "@/lib/toc";

type TocProps = {
  items: TocItem[];
};

const TOP_OFFSET = 96; // 对应你的 sticky navbar 高度

export default function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState("");

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    if (!ids.length) return;

    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!headings.length) return;

    const updateActiveHeading = () => {
      let currentId = headings[0].id;

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();

        if (rect.top - TOP_OFFSET <= 0) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    updateActiveHeading();

    const observer = new IntersectionObserver(
      () => {
        updateActiveHeading();
      },
      {
        rootMargin: `-${TOP_OFFSET}px 0px -70% 0px`,
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("hashchange", updateActiveHeading);

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("hashchange", updateActiveHeading);
    };
  }, [ids]);

  if (!items.length) return null;

  return (
    <aside className="sticky top-24 hidden w-64 shrink-0 xl:block">
      <div className="text-sm">
        <p className="mb-4 font-semibold text-white/80">目录</p>

        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                <a
                  href={`#${item.id}`}
                  className={`block transition-colors ${
                    isActive
                      ? "font-medium text-[#5EEAD4]"
                      : item.level === 3
                        ? "text-white/60 hover:text-[#5EEAD4]"
                        : "text-white/80 hover:text-[#5EEAD4]"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
