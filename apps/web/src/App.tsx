import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ptBR from 'antd/locale/pt_BR'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { AppLayout } from '@/components/layout/AppLayout'
import { BooksPage } from '@/routes/BooksPage'
import { AuthorsPage } from '@/routes/AuthorsPage'

dayjs.locale('pt-br')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
})

const theme = {
  token: {
    colorPrimary: '#2d4739',
    borderRadius: 6,
  },
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={ptBR}>
        <AntApp>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/books" replace />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/authors" element={<AuthorsPage />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}