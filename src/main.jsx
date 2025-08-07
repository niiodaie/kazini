import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeGA } from './utils/analytics'
import { initializeAdSense } from './utils/adsense'

// Initialize Google Analytics and AdSense
if (typeof window !== 'undefined') {
  // Initialize Google Analytics
  initializeGA();
  
  // Initialize Google AdSense
  initializeAdSense();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)