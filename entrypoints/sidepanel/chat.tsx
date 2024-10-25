import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";
import { ArrowBigDown, Copy, RefreshCcw, Send } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { marked } from "marked";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Chat() {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  useEffect(() => {
    browser.storage.local.get("messages").then((result) => {
      if (result.messages) {
        setInitialMessages(result.messages);
      }
    });
  }, []);
  return <Chat_ initialMessages={initialMessages} />;
}

function Chat_({ initialMessages }: { initialMessages: Message[] }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    append,
    setInput,
    reload,
    isLoading,
  } = useChat({
    maxSteps: 5,
    api: "https://glimmer.adastra.tw/api/chat",
    initialMessages: initialMessages,
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {},
  });

  const [bottomVisible, setBottomVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [quote, setQuote] = useState("");
  const [composition, setComposition] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleScrollToBottom = (behavior: ScrollBehavior = "auto") => {
    bottomRef.current?.scrollIntoView({
      behavior,
    });
  };

  const syncMessages = async (messages_: Message[]) => {
    const { messages: storedMessages } = (await browser.storage.local.get(
      "messages"
    )) as { messages: Message[] };
    const newMessages = storedMessages
      ? [...storedMessages, ...messages_]
      : messages_;
    const uniqueMessages = newMessages.reverse().filter(
      (m, i, self) => self.findIndex((m_) => m_.id === m.id) === i
    ).reverse();
    await browser.storage.local.set({ messages: uniqueMessages });
  };

  useEffect(() => {
    document.addEventListener("compositionstart", () => {
      setComposition(true);
    });
    document.addEventListener("compositionend", () => {
      setComposition(false);
    });
    return () => {
      document.removeEventListener("compositionstart", () => {
        setComposition(true);
      });
      document.removeEventListener("compositionend", () => {
        setComposition(false);
      });
    };
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - 10,
        });
        if (rect.top + window.scrollY - 10 < 0) {
          setIsTooltipVisible(false);
        } else {
          setIsTooltipVisible(true);
        }
      }
    } else {
      setIsTooltipVisible(false);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleTextSelection, handleMouseDown]);

  const handleOption = (option: string) => {
    switch (option) {
      case "Copy":
        navigator.clipboard.writeText(selectedText);
        break;
      case "Quote":
        setQuote(selectedText);
        break;
      case "Google It":
        window.open(`https://www.google.com/search?q=${selectedText}`);
        break;
      default:
        break;
    }
    setIsTooltipVisible(false);
  };

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleTextareaChange();
  }, [input]);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleTextSelection, handleMouseDown]);

  useEffect(() => {
    if (!bottomRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setBottomVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    handleScrollToBottom("smooth");
  }, []);

  useEffect(() => {
    if (bottomVisible) {
      handleScrollToBottom();
    }

    syncMessages(messages);
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full pb-32">
      <TooltipProvider>
        <Tooltip open={isTooltipVisible}>
          <TooltipTrigger asChild>
            <span
              style={{
                position: "fixed",
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                pointerEvents: "none",
              }}
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="flex space-x-2">
            <Button size="sm" onClick={() => handleOption("Copy")}>
              Copy
            </Button>
            <Button size="sm" onClick={() => handleOption("Quote")}>
              Quote
            </Button>
            <Button size="sm" onClick={() => handleOption("Google It")}>
              Google It
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {messages?.map(
        (m: Message) =>
          m.role !== "system" &&
          (m.content || m.toolInvocations) && (
            <div
              key={m.id}
              className={`w-fit py-8 ${
                m.role === "user"
                  ? "ml-auto max-w-[80%]"
                  : "mr-auto max-w-[80%] text-left"
              }`}
            >
              <div className="relative mx-auto flex space-x-4 px-4">
                <div className="flex-shrink-0">
                  {m.role === "user" ? null : (
                    <div className="flex-shrink-0">
                      <img
                        src="/icon/128.png"
                        className="w-8 h-8 rounded-full"
                        width={128}
                        height={128}
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  <MessageContent content={m.content} />
                  {m.role === "assistant" && !isLoading && m.content && (
                    <>
                      <CopyButton text={m.content} variant="ghost" size="icon">
                        <Copy className="text-muted-foreground size-full" />
                      </CopyButton>

                      <ReloadButton reload={reload} variant="ghost" size="icon">
                        <RefreshCcw className="text-muted-foreground size-full" />
                      </ReloadButton>
                    </>
                  )}

                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                    const toolCallId = toolInvocation.toolCallId;
                    const addResult = (result: string) =>
                      addToolResult({ toolCallId, result });

                    if (toolInvocation.toolName === "askForConfirmation") {
                      return (
                        <div
                          key={toolCallId}
                          className="bg-background rounded-md border p-4 shadow-sm"
                        >
                          <p className="text-muted mb-3 text-sm">
                            {toolInvocation.args.message}
                          </p>
                          {"result" in toolInvocation ? (
                            <p className="text-sm font-medium text-green-600">
                              {toolInvocation.result}
                            </p>
                          ) : (
                            <div className="space-x-2">
                              <Button
                                onClick={() => addResult("Yes")}
                                variant="outline"
                                size="sm"
                              >
                                Yes
                              </Button>
                              <Button
                                onClick={() => addResult("No")}
                                variant="outline"
                                size="sm"
                              >
                                No
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return "result" in toolInvocation ? (
                      <details
                        key={toolCallId}
                        className="bg-background mt-4 rounded-md border p-4 shadow-sm"
                      >
                        <summary className="text-muted-foreground mb-1 text-xs">
                          Tool: {toolInvocation.toolName}
                        </summary>
                        <p className="text-muted-foreground text-xs">
                          {toolInvocation.result}
                        </p>
                      </details>
                    ) : (
                      <div
                        key={toolCallId}
                        className="bg-background border-muted shadow-xs mt-4 animate-pulse rounded-md border p-4"
                      >
                        <p className="text-muted-foreground text-xs">
                          Calling {toolInvocation.toolName}...
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
      )}

      <div ref={bottomRef} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fullMessage = quote ? `> ${quote}\n\n${input}` : input;
          append({
            id: uuid(),
            role: "user",
            content: fullMessage,
          });
          setInput("");
          setQuote("");
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        ref={formRef}
        className="fixed bottom-4 left-4 right-16 m-auto  flex max-w-md flex-col gap-2"
      >
        {/* quote */}
        {quote && (
          <div className="bg-background border-muted shadow-xs relative rounded-md border p-4">
            <p className="text-muted-foreground text-xs">{quote}</p>
            <Button
              onClick={() => setQuote("")}
              size="sm"
              className="absolute bottom-2 right-2"
              variant={"secondary"}
            >
              Clear
            </Button>
          </div>
        )}

        {/* <Input
          type="file"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
          className="border"
        /> */}
        <Textarea
          ref={textareaRef}
          className="bg-background h-auto max-h-[200px] min-h-[40px] resize-none overflow-hidden rounded-lg border px-4 py-4 pr-12 text-base"
          rows={1}
          value={input}
          onChange={(e) => {
            handleInputChange(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !composition) {
              e.preventDefault();
              const fullMessage = quote ? `> ${quote}\n\n${input}` : input;
              append({
                id: uuid(),
                role: "user",
                content: fullMessage,
              });
              setInput("");
              setQuote("");
              setFiles(undefined);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }}
        />
        <Button
          type="submit"
          className="absolute bottom-2 right-2"
          size="icon"
          loading={isLoading}
        >
          <Send className="size-full" />
        </Button>
      </form>
      <AnimatePresence>
        {!bottomVisible && (
          <motion.button
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="z-100 bg-background fixed bottom-20 h-12 w-12 self-center rounded-full border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArrowBigDown className="m-auto" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

const MessageContent = memo(({ content }: { content: string }) => {
  return (
    <div
      className="prose max-w-xl"
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
});

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  text: string;
}

const CopyButton = memo(
  ({ text, children, variant, ...props }: CopyButtonProps) => {
    return (
      <Button
        variant={variant}
        onClick={() => navigator.clipboard.writeText(text)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

interface ReloadButtonProps extends React.ComponentProps<typeof Button> {
  reload: () => void;
}

const ReloadButton = memo(
  ({ reload, children, variant, ...props }: ReloadButtonProps) => {
    return (
      <Button variant={variant} onClick={reload} {...props}>
        {children}
      </Button>
    );
  }
);
