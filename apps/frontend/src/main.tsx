import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'
import TodosProvider from './context/TodosProvider.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ChakraProvider>
      <AuthProvider>
        <TodosProvider>
          <App />
        </TodosProvider>
      </AuthProvider>
    </ChakraProvider>
  </BrowserRouter>
)
