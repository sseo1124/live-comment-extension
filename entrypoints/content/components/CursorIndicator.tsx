type CursorIndicatorProps = {
  x: number;
  y: number;
};

export function CursorIndicator({ x, y }: CursorIndicatorProps) {
  return (
    <div
      className="pointer-events-none fixed z-[2147483647] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_-10%,rgba(180,238,252,0.95),rgba(129,140,248,0.9))] shadow-[0_12px_40px_-18px_rgba(59,130,246,0.8)]"
      style={{ left: x, top: y }}
    >
      <span className="sr-only">Comment placement cursor</span>
    </div>
  );
}
