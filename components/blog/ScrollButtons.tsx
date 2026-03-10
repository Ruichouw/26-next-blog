"use client";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";

export default function ScrollButtons() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-xl flex gap-3 text-sm">
      <button
        onClick={scrollToTop}
        className="flex gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-3 text-white shadow-lg hover:bg-neutral-700 "
      >
        <ArrowUpIcon className="h-5 w-5 text-white/50 " />
        回到顶部
      </button>

      <button
        onClick={scrollToBottom}
        className="flex gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-3 text-white shadow-lg hover:bg-neutral-700"
      >
        <ArrowUpIcon className="h-5 w-5 text-white/50 rotate-180" />
        跳转底部
      </button>
    </div>
  );
}
