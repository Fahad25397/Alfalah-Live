import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext' // <-- Added this
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrencyProvider> {/* <-- Wrapped App here */}
      <App />
    </CurrencyProvider>
  </React.StrictMode>,
)