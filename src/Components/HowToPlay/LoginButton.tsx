import { useUI } from "@/providers/UIProvider";
import { motion } from "framer-motion";
import React from "react";
import Button from "../LandingScreen/Button";

const LoginButton = () => {
  const { openLogin } = useUI();
  return (
    <motion.div
      key="login-button"
      className="relative self-end"
      onClick={openLogin}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Button onClick={openLogin} className="border bg-gray-900 text-white cursor-pointer">
        Log In
      </Button>
      <span
        aria-hidden="true"
        className="absolute top-0.75 right-0.75 block size-2 rounded-full bg-red-600 animate-pulse"
      />
    </motion.div>
  );
};

export default LoginButton;
