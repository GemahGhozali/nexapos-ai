"use client";

import {
  MessageScroller,
  MessageScrollerItem,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";

import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { ChatHistory } from "../schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { UseMutationResult } from "@tanstack/react-query";
import { CopilotChatProfile } from "./copilot-chat-profile";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { RoboticIcon, UndoIcon } from "@hugeicons/core-free-icons";
import { Message, MessageContent } from "@/components/ui/message";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface MessageBoxProps {
  mutation: UseMutationResult<{ success: boolean; message: string; data: string }, Error, ChatHistory, unknown>;
  messages: ChatHistory;
}

export function MessageBox({ messages, mutation }: MessageBoxProps) {
  if (messages.length === 0) {
    return (
      <Empty className="flex-1 p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/20 text-emerald-600 rounded-full">
            <HugeiconsIcon icon={RoboticIcon} size={16} color="currentColor" strokeWidth={1.5} />
          </EmptyMedia>
          <EmptyTitle>Ada yang bisa saya bantu?</EmptyTitle>
          <EmptyDescription>Saya bisa memahami, menjawab serta menganalisa data seputar bisnis anda</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      <MessageScrollerProvider scrollPreviousItemPeek={64}>
        <MessageScroller>
          <MessageScrollerViewport className="p-6">
            <MessageScrollerContent>
              {messages.map((message, index) => (
                <MessageScrollerItem key={`message-${index}`} messageId={`message-${index}`} scrollAnchor={message.role === "user"}>
                  <Message align={message.role === "user" ? "end" : "start"}>
                    <MessageContent className="leading-6 gap-1">
                      {message.role === "assistant" ? (
                        <Fragment>
                          <CopilotChatProfile />
                          <div className="w-full markdown">
                            <Markdown>{message.content}</Markdown>
                          </div>
                        </Fragment>
                      ) : (
                        <Bubble variant="secondary">
                          <BubbleContent>{message.content}</BubbleContent>
                        </Bubble>
                      )}
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
              {mutation.isPending && (
                <MessageScrollerItem>
                  <Message>
                    <MessageContent className="leading-6 gap-1">
                      <CopilotChatProfile />
                      <p className="text-muted-foreground animate-pulse">AI Business Copilot sedang memproses...</p>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
              {mutation.isError && (
                <MessageScrollerItem>
                  <Message>
                    <MessageContent className="leading-6 gap-2">
                      <CopilotChatProfile />
                      <p>❌ Terjadi Kesalahan: {mutation.error.message} Silahkan klik tombol dibawah untuk mencoba kembali.</p>
                      <Button variant="secondary" className="w-fit" onClick={() => mutation.mutate(messages)}>
                        Coba Kembali
                        <HugeiconsIcon icon={UndoIcon} size={12} color="currentColor" strokeWidth={1.75} data-icon="inline-end" />
                      </Button>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}
