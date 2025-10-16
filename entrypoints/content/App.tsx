/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { CursorIndicator } from "./components/CursorIndicator";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { ThreadComposer } from "./components/ThreadComposer";
import { ThreadList } from "./components/ThreadList";
import type { ContentAppProps, Thread, ToolbarMode } from "./types";

export default function ContentApp({
  projectId,
  roomId,
  accessToken,
}: ContentAppProps) {
  const [joined, setJoined] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [content, setContent] = useState("");
  const socketRef = useRef<Socket | null>(null);

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

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", { roomId }, (ack: any) => {
        if (ack?.ok) {
          setJoined(true);
        } else {
          setJoined(false);
          setErr(ack?.code || "JOIN_ERROR");
        }
      });
    });

    socket.on("room_joined", () => setJoined(true));
    socket.on("connect_error", (e) => {
      setJoined(false);
      setErr(e?.message || "CONNECT_ERROR");
    });
    socket.on("error", (e: any) => {
      setJoined(false);
      setErr(e?.code || "ERROR");
    });
    socket.on("disconnect", () => setJoined(false));

    socket.on("thread:created", (t: Thread) => {
      setThreads((prev) =>
        prev.some((x) => x._id === t._id) ? prev : [...prev, t]
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, roomId]);

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

  const handleSubmit = () => {
    if (!joined || !socketRef.current) return;
    const trimmed = content.trim();
    if (!trimmed) return;

    const tempId = `tmp_${Date.now()}`;
    setThreads((prev) => [
      ...prev,
      {
        _id: tempId,
        content: trimmed,
        resolved: false,
        createdAt: new Date().toISOString(),
        createdBy: "me",
        __v: 0,
      } as any,
    ]);

    socketRef.current.emit(
      "thread:create",
      { roomId, content: trimmed, tempId },
      (ack: any) => {
        if (!ack?.ok) {
          setThreads((prev) => prev.filter((t) => t._id !== tempId));
          alert(`생성 실패: ${ack?.code || "ERROR"}`);
          return;
        }
        setContent("");
      }
    );
  };
  return (
    <div ref={rootRef} data-live-comment-root="true">
      <div className="w-80 rounded-lg bg-neutral-900 p-3 text-xs text-white shadow-lg">
        <div className="mt-2 max-h-52 overflow-y-auto rounded-md border border-neutral-700 p-2">
          <ThreadList threads={threads} />
        </div>
        <ThreadComposer
          value={content}
          disabled={!joined}
          onChange={(value) => setContent(value)}
          onSubmit={handleSubmit}
        />
      </div>
      <FloatingToolbar mode={mode} onModeChange={(next) => setMode(next)} />

      {isAdding && cursorPos ? (
        <CursorIndicator x={cursorPos.x} y={cursorPos.y} />
      ) : null}
    </div>
  );
}
