import { Plus, TextAlignEnd } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function FloatingToolbar() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-10 shadow-2xl bg-white p-3 rounded-lg backdrop-blur-2xl z-[2147483646]">
      <ToggleGroup type="single" spacing={2} size="lg">
        <ToggleGroupItem value="add" aria-label="add notes">
          <Plus className="size-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="open notes">
          <TextAlignEnd className="size-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
