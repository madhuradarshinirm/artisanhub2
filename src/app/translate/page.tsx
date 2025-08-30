"use client";

import { translateAndRestate } from "@/ai/flows/translate-and-restate";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { languages } from "@/lib/languages";
import { cn } from "@/lib/utils";
import { Globe, SendHorizonal, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  isUser: boolean;
  text: string;
  originalText?: string;
  restatement?: string;
};

export default function TranslatePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), isUser: true, text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const result = await translateAndRestate({
        text: currentInput,
        targetLanguage,
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        isUser: false,
        text: result.translatedText,
        originalText: currentInput,
        restatement: result.restatementSuggestion,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation Error",
        description: "Failed to get a translation. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, prev.length - 1)); // remove user message on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">TalkBridge</h1>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground pt-10">
                <p>Start a conversation by typing a message below.</p>
                <p>Select a language to translate to from the dropdown above.</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Bot className="w-6 h-6" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-lg rounded-xl p-4",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  )}
                >
                  {message.isUser ? (
                    <p>{message.text}</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Original</p>
                        <p>{message.originalText}</p>
                      </div>
                      <div className="border-t my-2" />
                      <div>
                        <p className="text-sm font-semibold text-primary">{targetLanguage}</p>
                        <p className="font-semibold text-foreground">{message.text}</p>
                      </div>
                      {message.restatement && (
                        <>
                          <div className="border-t my-2" />
                          <div>
                            <p className="text-sm font-semibold text-accent-foreground">Suggestion</p>
                            <p className="italic text-muted-foreground">"{message.restatement}"</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                 {message.isUser && (
                  <div className="p-2 rounded-full bg-accent/20 text-accent">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Bot className="w-6 h-6" />
                  </div>
                <div className="flex items-center space-x-1.5 p-4">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
      <footer className="p-4 bg-card border-t">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-accent hover:bg-accent/90">
              <SendHorizonal className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
