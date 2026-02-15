import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App';

// Nunito font (self-hosted via fontsource — no Google Fonts network request needed)
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
