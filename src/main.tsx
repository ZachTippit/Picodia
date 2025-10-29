import { createRoot } from 'react-dom/client';
import './styles.css';
import './animations.css';
import './Components/toggleSlider.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';
import { SupabaseProvider } from './SupabaseProvider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </ClerkProvider>
);

reportWebVitals();
