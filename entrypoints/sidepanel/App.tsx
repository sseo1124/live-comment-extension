import { EmptyProject, LoginForm } from "@/components/sidepanel";

export default function SidepanelApp() {
  return (
    <div className="flex min-h-screen flex-col bg-sidebar p-4 text-sidebar-foreground">
      <LoginForm />
      <EmptyProject />
    </div>
  );
}
