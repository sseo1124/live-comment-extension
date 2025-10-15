import { useState } from "react";
import { LoginForm, ProjectSelect } from "@/components/sidepanel";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SidepanelApp() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <ScrollArea className="flex min-h-screen flex-col bg-sidebar p-4 text-sidebar-foreground">
      <LoginForm
        accessToken={accessToken}
        onAccessTokenChange={setAccessToken}
      />
      <ProjectSelect accessToken={accessToken} />
    </ScrollArea>
  );
}
