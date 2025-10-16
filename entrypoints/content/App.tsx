import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Plus } from "lucide-react";

type ContentAppProps = {
  projectId: string;
  roomId: string;
  accessToken: string;
};
type ToolbarMode = "add" | "palette" | "list";

export default function ContentApp({
  projectId,
  roomId,
  accessToken,
}: ContentAppProps) {
  const [user, setUser] = useState();
  const [mode, setMode] = useState<ToolbarMode>("palette");
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isAdding = mode === "add";

  useEffect(() => {
    const socket = io(import.meta.env.WXT_API_URL, {
      extraHeaders: {
        authorization: `bearer ${accessToken}`,
      },
    });

    socket.on("connect", () => {
      socket.emit("whoami", (username) => {
        setUser(username);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

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

  return (
    <div ref={rootRef} data-live-comment-root="true">
      <div className="w-full bg-amber-100">
        <div>{`projectId: ${projectId}/ roomId: ${roomId} / accessToken: ${accessToken}`}</div>
        <div>{user}</div>
      </div>
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
