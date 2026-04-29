import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Service Worker registratie
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((reg) => console.log('Service Worker geregistreerd:', reg.scope))
      .catch((err) => console.warn('Service Worker mislukt:', err))

    // Navigeer naar sectie bij notificatieklik
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'navigate') {
        window.location.hash = event.data.path
      }
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
