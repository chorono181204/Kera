import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Experimental_CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'


import theme from './theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { injectStore } from './utils/authorizeAxios.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
injectStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename={'/'}>
        <Experimental_CssVarsProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-right" theme={'colored'}/>
        </Experimental_CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
