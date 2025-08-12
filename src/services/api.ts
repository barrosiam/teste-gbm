import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://json-server-teste-gbm-ybm1.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
})
