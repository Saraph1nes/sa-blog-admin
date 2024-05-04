import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from '../../config.js'

const service = axios.create({
  // baseURL: 'https://api.sablogs.cn/api',
  baseURL: baseURL,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const AccessToken = localStorage.getItem('AccessToken')
      localStorage.getItem('ExpiresIn')
      localStorage.getItem('TokenType')
      if (AccessToken) {
        config.headers['Authorization'] = AccessToken
      }
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.Code === 40000) {
      ElMessage.error(res.Msg || '接口错误')
      return res
    }
    if (res.Code === 42200) {
      ElMessage.error(res.Msg || '接口错误')
      return res
    }
    if (res.Code === 40100) {
      ElMessage.error('请先登录')
      return res
    }
    return res
  },
  (error) => {
    console.log('接口信息报错' + error)
    return Promise.reject(error)
  }
)

export default service
