import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "@/components/login/LoginPage";
import ChatDashboard from "@/components/chat/ChatDashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
          <LoginPage onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChatDashboard onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
