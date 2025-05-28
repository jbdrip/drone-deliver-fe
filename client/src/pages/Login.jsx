import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authLogin } from "../services/auth.service"
import Cookies from "js-cookie"


export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const loginRes = await authLogin({ username: email, password })

      const options = {
        expires: 1, // Número de días antes de que la cookie expire
        sameSite: 'Lax', // Configura SameSite para Lax
        path: '/' // Define el camino en el cual la cookie es válida
      }

      if(loginRes && loginRes.status === 'success') {
        // Guardar el token de acceso en una cookie
        Cookies.set('access_token', loginRes.data.access_token, options)
        // Cookies.set('usuario', JSON.stringify(loginRes.data.usuario), options)
        navigate("/dashboard")
      } else {
        setError(loginRes.mensaje || "Error al iniciar sesión.")
      }
      
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.mensaje || "Error al iniciar sesión.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 text-center">Iniciar sesión</h2>
        <div className="my-4">
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <label className="block text-gray-700">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-9">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}