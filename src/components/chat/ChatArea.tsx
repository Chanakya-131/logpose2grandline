import { motion } from "framer-motion";
import { Compass, Ship, Anchor } from "lucide-react";
import { useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";

interface ChatAreaProps {
  messages: Message[];
}

const ChatArea = ({ messages }: ChatAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero icon */}
          <motion.div
            className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-5xl">🏴‍☠️</span>
          </motion.div>

          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">Set Sail with Luffytaro!</span>
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Yo, Captain! Ready to explore the Grand Line of knowledge? 
            Ask me anything and I'll search the seven seas of the internet 
            to find your treasure!
          </p>

          {/* Quick suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Compass, text: "What's the latest in tech?" },
              { icon: Ship, text: "Explain quantum computing" },
              { icon: Anchor, text: "Top news today" },
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all text-left group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <suggestion.icon className="w-5 h-5 text-primary mb-2 group-hover:text-accent transition-colors" />
                <p className="text-sm text-foreground">{suggestion.text}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatArea;
