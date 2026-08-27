import { RoboticIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function CopilotChatProfile() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid place-content-center size-7 rounded-full shrink-0 text-emerald-600 bg-primary/30">
        <HugeiconsIcon icon={RoboticIcon} size={16} color="currentColor" strokeWidth={1.5} />
      </div>
      <span className="text-muted-foreground font-medium">AI Business Copilot</span>
    </div>
  );
}
