import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AtSign,
  List,
  Paperclip,
  Plus,
  SendHorizonal,
  Smile,
} from "lucide-react";

type ToolbarMode = "add" | "palette" | "list";

type CommentThread = {
  id: string;
  x: number;
  y: number;
  text: string;
};

const createThreadId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `thread-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function ContentApp() {
  const [mode, setMode] = useState<ToolbarMode>("palette");
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [threads, setThreads] = useState<CommentThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isAdding = mode === "add";

  useEffect(() => {
    if (!isAdding) {
      setCursorPos(null);
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && rootRef.current?.contains(target)) {
        return;
      }

      const id = createThreadId();
      setThreads((prev) => [
        ...prev,
        {
          id,
          x: event.clientX,
          y: event.clientY,
          text: "",
        },
      ]);
      setActiveThreadId(id);
      setMode("palette");
      setCursorPos(null);
      window.getSelection?.()?.removeAllRanges?.();
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isAdding]);

  useEffect(() => {
    if (!isAdding) {
      return;
    }

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [isAdding]);

  const handleThreadTextChange = (id: string, value: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              text: value,
            }
          : thread
      )
    );
  };

  const getThreadPosition = (thread: CommentThread) => {
    const padding = 24;
    const circleRadius = 20;
    const horizontalGap = 12;
    const cardWidth = 280;
    const cardHeight = 150;
    const totalWidth = circleRadius * 2 + horizontalGap + cardWidth;

    if (typeof window === "undefined") {
      return {
        left: thread.x - circleRadius,
        top: thread.y - circleRadius,
      };
    }

    const rawLeft = thread.x - circleRadius;
    const rawTop = thread.y - circleRadius;

    const maxLeft = Math.max(padding, window.innerWidth - padding - totalWidth);
    const maxTop = Math.max(padding, window.innerHeight - padding - cardHeight);

    return {
      left: Math.min(Math.max(rawLeft, padding), maxLeft),
      top: Math.min(Math.max(rawTop, padding), maxTop),
    };
  };

  return (
    <div ref={rootRef} data-live-comment-root="true">
      <div className="fixed left-1/2 bottom-12 z-[2147483646] -translate-x-1/2 px-4">
        <div className="rounded-full border border-white/15 bg-white/90 p-1 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] backdrop-blur">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              const next = (value as ToolbarMode | "") || "palette";
              setMode(next);
            }}
            className="gap-1 rounded-full bg-transparent"
          >
            <ToggleGroupItem
              value="add"
              className="h-11 w-11 rounded-full text-zinc-500 transition data-[state=on]:bg-zinc-900 data-[state=on]:text-white"
              aria-label="Add note"
            >
              <Plus className="size-5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="palette"
              className="h-11 rounded-full px-6 text-zinc-600 transition data-[state=on]:bg-zinc-900 data-[state=on]:text-white"
              aria-label="Palette modes"
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-sky-200" />
                <span className="h-3 w-3 rounded-full bg-sky-400" />
                <span className="h-3 w-3 rounded-full bg-sky-200" />
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              className="h-11 w-11 rounded-full text-zinc-500 transition data-[state=on]:bg-zinc-900 data-[state=on]:text-white"
              aria-label="Open notes"
            >
              <List className="size-5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {threads.map((thread) => {
        const style = getThreadPosition(thread);

        return (
          <div key={thread.id} className="fixed z-[2147483646]" style={style}>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_-10%,rgba(180,238,252,0.95),rgba(129,140,248,0.9))] shadow-[0_12px_40px_-18px_rgba(59,130,246,0.8)]" />
              <div className="w-[280px] rounded-2xl border border-zinc-200 bg-white/95 p-3 text-left shadow-[0_28px_65px_-32px_rgba(15,23,42,0.55)] backdrop-blur">
                <label className="sr-only" htmlFor={`${thread.id}-input`}>
                  Write a comment
                </label>
                <textarea
                  id={`${thread.id}-input`}
                  value={thread.text}
                  onChange={(event) =>
                    handleThreadTextChange(thread.id, event.target.value)
                  }
                  onFocus={() => setActiveThreadId(thread.id)}
                  placeholder="Write a comment..."
                  autoFocus={thread.id === activeThreadId}
                  className="min-h-[64px] w-full resize-none rounded-xl border border-transparent bg-white/80 px-3 py-2 text-sm text-zinc-700 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-200 focus:bg-white focus:shadow-inner"
                />
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full p-1.5 transition hover:text-zinc-600"
                      aria-label="Insert emoji"
                    >
                      <Smile className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full p-1.5 transition hover:text-zinc-600"
                      aria-label="Mention someone"
                    >
                      <AtSign className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full p-1.5 transition hover:text-zinc-600"
                      aria-label="Attach file"
                    >
                      <Paperclip className="size-4" />
                    </button>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 rounded-full bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-800"
                  >
                    <span className="flex items-center gap-1">
                      Send
                      <SendHorizonal className="size-3.5" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isAdding && cursorPos ? (
        <div
          className="pointer-events-none fixed z-[2147483647] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_-10%,rgba(180,238,252,0.95),rgba(129,140,248,0.9))] shadow-[0_12px_40px_-18px_rgba(59,130,246,0.8)]"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <span className="sr-only">Comment placement cursor</span>
        </div>
      ) : null}
    </div>
  );
}
