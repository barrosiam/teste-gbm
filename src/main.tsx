import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes'
import { ToastProvider } from './components/toast/ToastProvider.tsx'
import { Header } from './components/header';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <ToastProvider>
          <Header />  
        <App />
      </ToastProvider>
    </Theme>
  </StrictMode>,
)
