import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext' // <-- Added this
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <CurrencyProvider> {/* <-- Wrapped App here */}
        <App />
      </CurrencyProvider>
    </HelmetProvider>
  </React.StrictMode>,
)