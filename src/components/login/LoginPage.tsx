import { motion } from "framer-motion";
import { Anchor, Compass, Ship } from "lucide-react";
import SecretCodeReveal from "./SecretCodeReveal";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(355 84% 45%) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(45 93% 58%) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Floating icons */}
        <motion.div
          className="absolute top-20 left-20 text-muted-foreground/20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Anchor className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-muted-foreground/15"
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <Compass className="w-12 h-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-40 text-muted-foreground/20"
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Ship className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Main login container */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-card p-8 md:p-12">
          {/* Logo/Title section */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Straw Hat icon */}
            <motion.div
              className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              animate={{ boxShadow: ["0 0 20px hsl(355 84% 45% / 0.3)", "0 0 40px hsl(355 84% 45% / 0.5)", "0 0 20px hsl(355 84% 45% / 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">🏴‍☠️</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Luffytaro</span>
            </h1>
            <p className="text-muted-foreground">
              AI Search Navigator
            </p>
          </motion.div>

          {/* Secret code reveal */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SecretCodeReveal onCodeClick={onLogin} />
          </motion.div>

          {/* Decorative bottom section */}
          <motion.div
            className="text-center pt-6 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-muted-foreground">
              "I'm gonna be the King of Search!"
            </p>
          </motion.div>
        </div>

        {/* Glow effect behind card */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/40 rounded-3xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
