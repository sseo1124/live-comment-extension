import { Sparkles } from "lucide-react";

export default function SidepanelApp() {
  return (
    <div className="flex min-h-screen flex-col bg-sidebar p-4 text-sidebar-foreground">
      <header className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-background/70 p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.65)] backdrop-blur">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/90 via-indigo-400/80 to-blue-900/70 text-white shadow-[0_20px_60px_-25px_rgba(56,189,248,0.95)]">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Live Comment
          </p>
          <h1 className="text-xl font-semibold text-foreground">
            사이드 패널 로그인
          </h1>
          <p className="text-sm text-muted-foreground">
            최신 피드백 도구로 팀 협업을 시작하세요.
          </p>
        </div>
      </header>
    </div>
  );
}
