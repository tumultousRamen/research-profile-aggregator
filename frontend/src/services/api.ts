import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const profileApi = {
  createProfile: async (profileData: any) => {
    const response = await api.post('/profiles', profileData)
    return response.data
  },
  
  getProfile: async (id: string) => {
    const response = await api.get(`/profiles/${id}`)
    return response.data
  },
  
  getPublications: async (id: string) => {
    const response = await api.get(`/profiles/${id}/publications`)
    return response.data
  },
  
  getSummary: async (id: string) => {
    const response = await api.get(`/profiles/${id}/summary`)
    return response.data
  },
}