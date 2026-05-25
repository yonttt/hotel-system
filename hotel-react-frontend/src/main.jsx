import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RefreshProvider } from './context/RefreshContext'
import { NotificationProvider } from './context/NotificationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <RefreshProvider>
        <App />
      </RefreshProvider>
    </NotificationProvider>
  </StrictMode>,
)
