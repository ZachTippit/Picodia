import { createRoot } from 'react-dom/client';
import './styles.css';
import './animations.css';
import './Components/toggleSlider.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SupabaseProvider } from './SupabaseProvider';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <SupabaseProvider>
    <App />
  </SupabaseProvider>
);

reportWebVitals();
