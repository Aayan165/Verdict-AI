import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4200,
            style: {
              background: '#23150F',
              color: '#F7F1DE',
              borderRadius: '14px',
              border: '1px solid rgba(247, 241, 222, 0.12)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}