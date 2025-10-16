type ThreadComposerProps = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function ThreadComposer({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ThreadComposerProps) {
  const canSubmit = !disabled && value.trim() !== "";

  return (
    <div className="mt-2 flex gap-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && canSubmit && onSubmit()}
        placeholder="내용 입력…"
        className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <button
        type="submit"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="rounded-md bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        등록
      </button>
    </div>
  );
}
