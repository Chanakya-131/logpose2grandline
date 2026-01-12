import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ChatSidebar, { ChatHistory } from "./ChatSidebar";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { Message } from "./ChatMessage";

interface ChatDashboardProps {
  onLogout: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type ChatMsg = { role: "user" | "assistant"; content: string };

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMsg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (resp.status === 429) {
      onError("Rate limit exceeded. The seas are busy, Captain! Try again in a moment.");
      return;
    }
    if (resp.status === 402) {
      onError("Payment required. Need more treasure to continue the voyage!");
      return;
    }
    if (!resp.ok || !resp.body) {
      onError("Failed to connect to the AI. The Grand Line is stormy right now!");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          /* ignore partial leftovers */
        }
      }
    }

    onDone();
  } catch (e) {
    console.error("Stream error:", e);
    onError("Connection lost. The sea kings got in the way!");
  }
}

const ChatDashboard = ({ onLogout }: ChatDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    setActiveChatId(newChatId);
    setMessages([]);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
  }, [activeChatId]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!activeChatId) {
      const newChatId = Date.now().toString();
      setActiveChatId(newChatId);
      setChatHistory((prev) => [
        {
          id: newChatId,
          title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
          preview: content.slice(0, 50),
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }

    const searchingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isSearching: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, searchingMessage]);
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 2).toString();
    let assistantContent = "";

    // Build conversation history for context
    const conversationHistory: ChatMsg[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    conversationHistory.push({ role: "user", content });

    // Remove searching message and add empty assistant message
    setMessages((prev) => [
      ...prev.filter((m) => !m.isSearching),
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    await streamChat({
      messages: conversationHistory,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: assistantContent }
              : m
          )
        );
      },
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        toast.error(error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: `⚠️ ${error}` }
              : m
          )
        );
        setIsLoading(false);
      },
    });
  }, [activeChatId, messages]);

  return (
    <motion.div
      className="h-screen flex overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea messages={messages} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default ChatDashboard;
