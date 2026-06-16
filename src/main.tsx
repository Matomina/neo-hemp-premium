import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context';
import { AdminAuthProvider } from './context/admin/AdminAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import './styles/global.css';
import './styles/theme.css';
import './styles/admin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
