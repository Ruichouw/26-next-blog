"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "@/lib/toc";
import ScrollButtons from "@/components/blog/ScrollButtons";

type TocProps = {
  items: TocItem[];
};

const TOP_OFFSET = 96; // 对应你的 sticky navbar 高度

export default function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState("");
  // 用intersection observer方案显示目录高亮

  // 用useMemo缓存来提取出目录项的id数组，保持ids的稳定，如果没用useMemo，每次组件重新渲染都会生成新的ids数组，导致useEffect的依赖变化，从而重新设置和清理观察器，性能较差。
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  // useEffect组件挂载后执行一次;ids变化时重新执行;组件卸载时清理观察器和事件监听器
  useEffect(() => {
    if (!ids.length) return;
    // map处理后返回的数据类型是(HTMLElement | null)[]，需要用filter过滤掉null值，并且告诉TypeScript过滤后是HTMLElement[]类型
    // : el is HTMLElement是自定义类型守卫，如果函数返回值是true,那么就确定el是HTMLElement类型
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!headings.length) return;
    // 根据标题位置是否越过基准线更新当前激活的目录项
    const updateActiveHeading = () => {
      let currentId = headings[0].id;

      for (const heading of headings) {
        // getBoundingClientRect() 返回元素的位置和尺寸信息
        const rect = heading.getBoundingClientRect();

        if (rect.top - TOP_OFFSET <= 0) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };
    // 先执行一次，初始化高亮状态，确保页面加载时就能正确高亮当前目录项，而不是等到用户滚动后才更新高亮状态。
    updateActiveHeading();

    const observer = new IntersectionObserver(
      () => {
        updateActiveHeading();
      },
      {
        // rootMargin缩小监听区域，top和bottom分别缩小96px和70%，这样当标题越过这个区域时就会触发回调函数，更新高亮状态。
        rootMargin: `-${TOP_OFFSET}px 0px -70% 0px`,
        // threshold是设置目标元素在可见区域达到多少比例时触发回调，[0, 1]表示元素只在刚进入或刚离开可见区域，以及完全进入可见区域时触发回调，这样可以避免在用户滚动过程中频繁触发回调，提升性能。
        threshold: [0, 1],
      },
    );
    // 把每个标题 DOM 都注册到 observer
    headings.forEach((heading) => observer.observe(heading));
    // { passive: true }告诉浏览器js不会阻止默认滚动，好处是滚动不卡顿。
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    // 当 URL 锚点变化时，此时立刻更新高亮。否则有时要等下一次 observer 或 scroll 才会刷新。
    window.addEventListener("hashchange", updateActiveHeading);
    // useEffect 中，return 用来返回一个“清理函数”，在 组件卸载 或 effect 重新执行之前，清理之前创建的副作用。
    return () => {
      // 取消观察每个标题;
      headings.forEach((heading) => observer.unobserve(heading));
      // 彻底断开 observer
      observer.disconnect();
      // 移除事件监听;
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("hashchange", updateActiveHeading);
    };
  }, [ids]);

  if (!items.length) return null;

  return (
    <aside className="sticky top-10 hidden w-64 shrink-0 xl:block">
      <div className="flex flex-col gap-6">
        <div className="text-sm rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-4">
          <div className="flex gap-1 items-center mb-4 font-semibold text-white/80">
            目录
          </div>

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
        <ScrollButtons />
      </div>
    </aside>
  );
}
