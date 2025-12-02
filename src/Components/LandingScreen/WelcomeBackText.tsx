import { useProfile } from "@/hooks/useProfile";
import { useSupabaseAuth } from "@/SupabaseProvider";
import React from "react";

const WelcomeBackText = () => {
  const { user } = useSupabaseAuth();
  const { data: profile } = useProfile();
  
  const displayName = profile?.display_name ?? user?.email;
  const hasName = Boolean(displayName);

  return <p className="font-bold">{hasName ? `Welcome back, ${displayName}` : "Welcome Back"}</p>;
};

export default WelcomeBackText;
