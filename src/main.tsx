import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/App.css'
import './styles/fonts.css'
import './styles/index.css'
import './styles/LoginBanner.css'
import './styles/XboxDashboard.css'
import './styles/Login.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
