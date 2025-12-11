import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-js/react";
import { UIProvider } from "./providers/UIProvider";
import { AppRouterProvider } from "./router";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

const queryClient = new QueryClient();

const App = () => {
  return (
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <AppRouterProvider />
        </UIProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};

export default App;
