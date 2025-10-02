import type { CursorOverlayData } from "@slate-yjs/react";
import { useRemoteCursorOverlayPositions } from "@slate-yjs/react";
import type { CSSProperties, PropsWithChildren } from "react";
import type { CursorData } from "@/types";
import clsx from "clsx";
import React, { useRef } from "react";
import { addAlpha } from "@/lib/random-cursor-data";

type CaretProps = Pick<CursorOverlayData<CursorData>, "caretPosition" | "data">;

function Caret({ caretPosition, data }: CaretProps) {
  const caretStyle: CSSProperties = {
    ...caretPosition,
    background: data?.color,
  };

  const labelStyle: CSSProperties = {
    transform: "translateY(-100%)",
    background: data?.color,
  };

  return (
    <div style={caretStyle} className="w-0.5 absolute">
      <div
        className="absolute text-xs text-white whitespace-nowrap top-0 rounded rounded-bl-none px-1.5 py-0.5"
        style={labelStyle}
      >
        {data?.name}
      </div>
    </div>
  );
}

function RemoteSelection({
  data,
  selectionRects,
  caretPosition,
}: CursorOverlayData<CursorData>) {
  if (!data) {
    return null;
  }

  const selectionStyle: CSSProperties = {
    backgroundColor: addAlpha(data.color, 0.5),
  };

  return (
    <React.Fragment>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="absolute pointer-events-none"
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </React.Fragment>
  );
}

type RemoteCursorsProps = PropsWithChildren<{
  className?: string;
}>;

export function RemoteCursorOverlay({
  className,
  children,
}: RemoteCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursors] = useRemoteCursorOverlayPositions<CursorData>({
    containerRef,
  });

  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      {children}
      {cursors.map((cursor) => (
        <RemoteSelection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  );
}
