import axios from 'axios'
const API = '/api'

export const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
})
