import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ChatSidebar, { ChatHistory } from "./ChatSidebar";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { Message } from "./ChatMessage";

interface ChatDashboardProps {
  onLogout: () => void;
}

// Mock responses for demo
const mockResponses = [
  "Let's set sail! I've scanned the seas of the internet and found some treasure for you, Captain!\n\nBased on my search, here's what I discovered:\n\n**Key Findings:**\n• The information you're looking for is trending across multiple sources\n• Several experts have weighed in on this topic\n• There are some exciting developments happening right now\n\nWant me to dive deeper into any specific aspect of this? I'm ready to explore further, Nakama!",
  "Yohohoho! Great question, Captain! After exploring the digital Grand Line, I've brought back some valuable intel!\n\n**Here's what I found:**\n\nThe latest data shows some fascinating trends. Multiple reliable sources confirm this information, and there's been significant activity around this topic recently.\n\n**My Analysis:**\nThis appears to be a hot topic with lots of engagement. The key players in this space are making moves, and there's definitely more to uncover.\n\nShall I continue the voyage and find more details? ⚓",
  "Gear 5 activated for this search! I've stretched my investigation across the entire internet, and here's the treasure I found!\n\n**Summary:**\nThis is definitely something worth paying attention to. The community is buzzing, and there are multiple perspectives to consider.\n\n**Important Points:**\n• First, the foundational aspects are solid\n• Second, there's growing momentum in this area  \n• Third, experts predict exciting developments ahead\n\nYou've got good instincts asking about this, Captain! Want me to elaborate on any of these points?",
];

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
    // In a real app, load messages for this chat
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
  }, [activeChatId]);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create or update chat in history
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

    // Add searching message
    const searchingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isSearching: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, searchingMessage]);
    setIsLoading(true);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get random response
    const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Stream the response
    const assistantMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: "assistant",
      content: "",
      sources: [
        { title: "Wikipedia", url: "https://wikipedia.org" },
        { title: "Research Paper", url: "https://arxiv.org" },
        { title: "News Source", url: "https://news.com" },
      ],
      timestamp: new Date(),
    };

    // Remove searching message and add empty assistant message
    setMessages((prev) => [
      ...prev.filter((m) => !m.isSearching),
      assistantMessage,
    ]);

    // Stream content word by word
    const words = responseContent.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: words.slice(0, i + 1).join(" ") }
            : m
        )
      );
    }

    setIsLoading(false);
  }, [activeChatId]);

  return (
    <motion.div
      className="h-screen flex overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea messages={messages} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default ChatDashboard;
