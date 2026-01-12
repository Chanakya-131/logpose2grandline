import { motion } from "framer-motion";
import { User, Compass, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isSearching?: boolean;
  sources?: { title: string; url: string }[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      className={cn(
        "flex gap-4 py-6",
        isAssistant ? "bg-secondary/30" : ""
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 flex gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
            isAssistant
              ? "bg-gradient-to-br from-primary to-accent"
              : "bg-muted"
          )}
        >
          {isAssistant ? (
            <span className="text-lg">🏴‍☠️</span>
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Role label */}
          <p className="text-sm font-medium">
            {isAssistant ? (
              <span className="text-accent">Luffytaro</span>
            ) : (
              <span className="text-muted-foreground">Captain</span>
            )}
          </p>

          {/* Searching indicator */}
          {message.isSearching && (
            <motion.div
              className="flex items-center gap-2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Compass className="w-4 h-4 animate-spin" />
              <span className="text-sm">Scanning the seas of the internet...</span>
            </motion.div>
          )}

          {/* Message content */}
          {!message.isSearching && (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">🗺️ Treasure Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs text-muted-foreground hover:text-accent hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
