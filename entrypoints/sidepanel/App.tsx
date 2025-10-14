import { EmptyProject, LoginForm, ProjectSelect } from "@/components/sidepanel";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SidepanelApp() {
  return (
    <ScrollArea className="flex min-h-screen flex-col bg-sidebar p-4 text-sidebar-foreground">
      <LoginForm />
      <EmptyProject />
      <ProjectSelect />
    </ScrollArea>
  );
}
