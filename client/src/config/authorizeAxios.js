import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

let store
export const injectStore = (_store) => {
  store = _store
}

let authorizeAxiosInstance = axios.create()

authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes

authorizeAxiosInstance.defaults.withCredentials = true

let refreshToekenPromise = null

// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // ky thuat chan click spam
    interceptorLoadingElements(true)

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    interceptorLoadingElements(false)

    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    interceptorLoadingElements(false)

    // neu ma loi 401 thi logout
    if (error?.response?.status === 401) {
      store.dispatch(logoutUserAPI(false))
    }

    const originalRequest = error.config

    if (error?.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshToekenPromise) {
        refreshToekenPromise = refreshTokenAPI()
          .then((data) => {
            return data
          })
          .catch(() => {
            // logout neu refresh token loi nhung ben tren co code bat loi 401 roi
            // store.dispatch(logoutUserAPI(false))
          })
          .finally(() => {
            refreshToekenPromise = null
          })
      }

      return refreshToekenPromise.then(() => {
        return authorizeAxiosInstance(originalRequest)
      })
    }

    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance