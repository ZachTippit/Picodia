import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageContainer from "./PageContainer";
import { UIProvider } from "./providers/UIProvider";
import { PostHogProvider } from "posthog-js/react";

// const analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// if (analyticsId) {
//   ReactGA.initialize(analyticsId);
// } else if (import.meta.env.DEV) {
//   // Surface helpful warning locally when analytics isn't configured.
//   // eslint-disable-next-line no-console
//   console.warn('Google Analytics ID is not set; analytics will be disabled.');
// }

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

const App = () => {
  const queryClient = new QueryClient();

  return (
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <PageContainer />
        </UIProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};

export default App;
