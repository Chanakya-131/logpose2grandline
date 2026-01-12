import { motion } from "framer-motion";
import { Send, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xl p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2">
          {/* Input container */}
          <div className="flex-1 relative">
            <motion.div
              className="absolute inset-0 rounded-xl -z-10"
              animate={{
                boxShadow: message
                  ? "0 0 20px hsl(355 84% 45% / 0.2)"
                  : "0 0 0 transparent",
              }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex items-end rounded-xl border border-border bg-input/50 focus-within:border-primary/50 transition-colors">
              <Search className="w-5 h-5 text-muted-foreground ml-4 mb-3.5 flex-shrink-0" />
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Luffytaro anything, Captain..."
                className="flex-1 resize-none bg-transparent px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px] scrollbar-thin"
                rows={1}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            disabled={!message.trim() || isLoading}
          >
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: "linear",
              }}
            >
              <Send className="w-5 h-5" />
            </motion.div>
          </Button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          Luffytaro searches the web to bring you the latest treasure of knowledge ⚓
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
