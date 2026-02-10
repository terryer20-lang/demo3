import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// NOTE: Service Worker registration has been removed to ensure the app loads correctly 
// in the AI Studio preview environment. 
// Please uncomment or add the following code in your local environment for PWA support:

/*
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('New content available, click on reload button to update.');
    },
    onOfflineReady() {
      console.log('App is ready to work offline.');
    },
  });
}
*/

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);