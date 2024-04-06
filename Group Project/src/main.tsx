import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '../@/components/ui/toast.tsx'
import AuthProvider from '../context/AuthContext';
import QueryProvider from '../@/lib/react_query/QueryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <ToastProvider>
                    <App/>
                </ToastProvider>
            </AuthProvider>     
        </QueryProvider> 
    </BrowserRouter>
)
