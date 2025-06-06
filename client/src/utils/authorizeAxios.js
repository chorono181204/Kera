// src/apis/authorizeAxiosInstance.js
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '../utils/formatter'
import { logoutUserAPI, setAccessToken } from '../redux/user/userSlice'
import { refreshTokenAPI } from '../apis' // hoặc './auth'

let store
export const injectStore = _store => {
  store = _store
}

// Các đường dẫn auth không cần add header / spinner
const AUTH_PATHS = ['auth/login', 'auth/register', 'auth/refresh']
function isAuthEndpoint(url = '') {
  return AUTH_PATHS.some(path => url.includes(path))
}

const authorizeAxiosInstance = axios.create({
  timeout: 1000 * 60 * 5, // 5 phút
  withCredentials: true // cookie httpOnly chứa refresh-token
})

let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}
function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}
function onRefreshFailed(err) {
  refreshSubscribers.forEach(cb => cb(null, err))
  refreshSubscribers = []
}

// 1) Request interceptor
authorizeAxiosInstance.interceptors.request.use(
  config => {
    const url = config.url || ''
    // chỉ show spinner cho non-auth
    if (!isAuthEndpoint(url)) {
      interceptorLoadingElements(true)
      const token = store.getState().user.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  err => {
    interceptorLoadingElements(false)
    return Promise.reject(err)
  }
)

// 2) Response interceptor
authorizeAxiosInstance.interceptors.response.use(
  res => {
    interceptorLoadingElements(false)
    return res
  },
  error => {
    interceptorLoadingElements(false)
    const { response, config: originalRequest } = error

    // network error
    if (!response) {
      toast.error('Network error!')
      return Promise.reject(error)
    }

    const status = response.status
    const hasAuthHeader = !!originalRequest.headers?.Authorization

    // 2.1) 401 ở public endpoints hoặc không có header → reject luôn
    if (status === 401 && (!hasAuthHeader || isAuthEndpoint(originalRequest.url))) {
      const msg = response.data?.message || error.message
      toast.error(msg)
      return Promise.reject(error)
    }

    // 2.2) 401 do token hết hạn (có header, chưa retry)
    if (status === 401 && hasAuthHeader && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        refreshTokenAPI({token:store.getState().user.accessToken})
          .then(({ accessToken }) => {
            store.dispatch(setAccessToken(accessToken))
            onRefreshed(accessToken)
          })
          .catch(err => {
            onRefreshFailed(err)
            store.dispatch(logoutUserAPI(true))
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token, err) => {
          if (err || !token) {
            return reject(err || new Error('Refresh token failed'))
          }
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(authorizeAxiosInstance(originalRequest))
        })
      })
    }

    // 2.3) 401 sau retry (refresh fail) → logout
    if (status === 401) {
      store.dispatch(logoutUserAPI(true))
      return Promise.reject(error)
    }

    // 2.4) lỗi khác → show toast
    const msg = response.data?.message || error.message
    toast.error(msg)
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
