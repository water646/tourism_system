import axios from 'axios'
const http1 = axios.create({
  baseURL: '/api',
  timeout: 50000,
})
//添加请求拦截器
http1.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//添加响应拦截器
http1.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default http1
