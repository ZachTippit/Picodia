import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GameProvider } from './GameContext';
import PageContainer from './PageContainer';

// const analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// if (analyticsId) {
//   ReactGA.initialize(analyticsId);
// } else if (import.meta.env.DEV) {
//   // Surface helpful warning locally when analytics isn't configured.
//   // eslint-disable-next-line no-console
//   console.warn('Google Analytics ID is not set; analytics will be disabled.');
// }

const App = () => {
  const queryClient = new QueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <PageContainer />
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
