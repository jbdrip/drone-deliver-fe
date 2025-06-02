import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export const useUserData = () => {

  const [userData, setUserData] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const options = {
    expires: 1, // Número de días antes de que la cookie expire
    sameSite: 'Lax', // Configura SameSite para Lax
    path: '/' // Define el camino en el cual la cookie es válida
  }

  const getUserData = () => {
    try {
      const userCookie = Cookies.get('usuario')
      if (userCookie) {
        return JSON.parse(userCookie)
      }
      return null
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error)
      throw error
    }
  }

  const getAccessToken = () => {
    try {
      return Cookies.get('access_token') || null
    } catch (error) {
      console.error('Error al obtener access token:', error)
      throw error
    }
  }

  const refreshUserData = () => {
    setLoading(true)
    setError(null)
    try {
      const data = getUserData()
      const token = getAccessToken()
      setUserData(data)
      setAccessToken(token)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUserData()
  }, [])

  // Función para actualizar datos del usuario
  const updateUserData = (newUserData) => {
    try {
      Cookies.set('usuario', JSON.stringify(newUserData), options)
      setUserData(newUserData)
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error)
      setError(error)
    }
  }

  // Función para actualizar access token
  const updateAccessToken = (newToken) => {
    try {
      if (newToken) {
        Cookies.set('access_token', newToken, options)
        setAccessToken(newToken)
      } else {
        Cookies.remove('access_token')
        setAccessToken(null)
      }
    } catch (error) {
      console.error('Error al actualizar access token:', error)
      setError(error)
    }
  }
  
  // Función para hacer login (actualizar ambos datos)
  const login = (userData, token) => {
    try {
      Cookies.set('usuario', JSON.stringify(userData))
      Cookies.set('access_token', token)
      setUserData(userData)
      setAccessToken(token)
    } catch (error) {
      console.error('Error al hacer login:', error)
      setError(error)
    }
  }

  // Función para hacer logout
  const logout = () => {
    Cookies.remove('access_token')
    Cookies.remove('usuario')
    setUserData(null)
    setAccessToken(null)
    window.location.href = '/'
  }

  return {
    userData,
    loading,
    error,
    userId: userData?.id || null,
    userName: userData?.full_name || 'Usuario',
    userEmail: userData?.email || '- - - - - -',
    userRole: userData?.role || 'customer',
    isAuthenticated: !!(userData && accessToken),
    refreshUserData,
    updateUserData,
    updateAccessToken,
    login,
    logout
  }
}