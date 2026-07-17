import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './Components/AuthContext.jsx';
import { SearchProvider } from './Components/SearchContext.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AuthProvider>
  </>,
)
