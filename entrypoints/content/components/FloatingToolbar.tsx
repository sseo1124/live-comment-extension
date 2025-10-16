import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Plus } from "lucide-react";

import type { ToolbarMode } from "../types";

type FloatingToolbarProps = {
  mode: ToolbarMode;
  // eslint-disable-next-line no-unused-vars
  onModeChange: (mode: ToolbarMode) => void;
};

export function FloatingToolbar({ mode, onModeChange }: FloatingToolbarProps) {
  return (
    <div className="fixed left-1/2 bottom-12 z-[2147483646] -translate-x-1/2 px-4">
      <div className="rounded-full border border-white/15 bg-white/90 p-1 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] backdrop-blur">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            const next = (value as ToolbarMode | "") || "palette";
            onModeChange(next);
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
  );
}
