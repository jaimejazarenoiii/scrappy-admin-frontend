import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/api/interceptors'
import { App } from '@/app/app'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
