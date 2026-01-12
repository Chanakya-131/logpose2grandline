import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { useState } from "react";

interface SecretCodeRevealProps {
  onCodeClick: () => void;
}

const SecretCodeReveal = ({ onCodeClick }: SecretCodeRevealProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const secretCode = "GEAR-FIVE-2024";

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {isHovered ? (
          <Unlock className="w-4 h-4 text-accent" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        <span>Secret Access Code</span>
      </div>

      <motion.div
        className="relative cursor-pointer select-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onCodeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: isHovered
              ? "0 0 40px hsl(45 93% 58% / 0.5)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Code container */}
        <div className="relative px-8 py-4 rounded-lg border border-border bg-secondary/50 overflow-hidden">
          {/* Shimmer effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
          )}

          {/* Secret code text */}
          <motion.span
            className="relative z-10 font-mono text-2xl font-bold tracking-widest"
            animate={{
              filter: isHovered ? "blur(0px)" : "blur(8px)",
              color: isHovered ? "hsl(45 93% 58%)" : "hsl(222 15% 55%)",
            }}
            transition={{ duration: 0.4 }}
          >
            {secretCode}
          </motion.span>
        </div>

        {/* Hover hint */}
        <motion.p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
          animate={{ opacity: isHovered ? 0 : 1 }}
        >
          Hover to reveal • Click to enter
        </motion.p>

        {/* Click to enter text */}
        <motion.p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-accent whitespace-nowrap font-medium"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          ⚡ Click to set sail!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SecretCodeReveal;
