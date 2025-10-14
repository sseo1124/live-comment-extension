import { EmptyProject, LoginForm, ProjectSelect } from "@/components/sidepanel";

export default function SidepanelApp() {
  return (
    <div className="flex min-h-screen flex-col bg-sidebar p-4 text-sidebar-foreground">
      <LoginForm />
      <EmptyProject />
      <ProjectSelect />
    </div>
  );
}
