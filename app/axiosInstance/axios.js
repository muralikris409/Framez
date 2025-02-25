import axios from 'axios'
import { useAppSelector } from '../lib/hooks';
import { getToken } from '../actions/cookieHandler';
export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL:process.env.API_BASE_URL,
})

axiosInstance.interceptors.request.use(async(config) => {
  const token = await getToken("token");
  console.log("inter",token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})
