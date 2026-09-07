"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { MessageBox } from "./message-box";
import { ChatHistory } from "../schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCopilotChat } from "../hooks";
import { Cancel01Icon, RoboticIcon } from "@hugeicons/core-free-icons";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CopilotSheet() {
  const [messages, setMessages] = useState<ChatHistory>([]);

  const { form, mutation } = useCopilotChat({
    onGetCopilotResponse: (message) => setMessages((prev) => [...prev, { role: "assistant", content: message }]),
  });

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="lg" className="fixed right-6 bottom-6" variant="default">
            <HugeiconsIcon icon={RoboticIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-start" />
            Tanya AI
          </Button>
        }
      />
      <SheetContent showCloseButton={false}>
        <SheetHeader className="border-b flex-row justify-between items-center">
          <div>
            <SheetTitle>AI Business Copilot</SheetTitle>
            <SheetDescription>Asisten cerdas untuk analisa bisnis anda</SheetDescription>
          </div>
          <SheetClose
            render={
              <Button variant="outline" size="icon-sm">
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
              </Button>
            }
          />
        </SheetHeader>
        <MessageBox mutation={mutation} messages={messages} />
        <SheetFooter className="shrink-0 pt-0">
          <ChatInput form={form} mutation={mutation} messages={messages} setMessages={setMessages} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
