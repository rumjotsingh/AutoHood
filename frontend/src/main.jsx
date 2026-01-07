import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './redux/store'
import theme from './theme/theme'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
)
