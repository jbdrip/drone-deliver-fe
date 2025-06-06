import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { forgotPassword } from "../services/auth.service"
import { toast } from "react-toastify"

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      email: ""
    }
  })

  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)
  const [resetToken, setResetToken] = useState("")

  const onSubmit = async (data) => {
    try {
      clearErrors("root")
      const response = await forgotPassword(data.email)
      
      if(response && response.status === 'success') {
        setResetToken(response.data.reset_token)
        setEmailSent(true)
      } else {
        setError("root", {
          type: "manual",
          message: response.message || "Error al enviar el correo."
        })
      }
    } catch (err) {
      console.error(err)
      setError("root", {
        type: "manual",
        message: err.response?.data?.detail || "Error al enviar el correo."
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetToken)
    toast.success("Token copiado al portapapeles")
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Token de recuperación generado
            </h2>
            <p className="text-gray-600">
              Copia el siguiente token para restablecer tu contraseña:
            </p>
          </div>
          
          {/* Alert con el token */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Token de recuperación
                </h3>
                <div className="bg-white rounded border p-3 mb-3">
                  <code className="text-sm text-gray-800 break-all font-mono">
                    {resetToken}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Copiar token
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate("/reset-password")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-3"
            >
              Ir a restablecer contraseña
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-2 text-center font-semibold">
          Recuperar contraseña
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
        
        <div className="mb-6">
          {errors.root && (
            <p className="text-red-500 mb-3 text-center">{errors.root.message}</p>
          )}
          
          <label className="block text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            {...register("email", {
              required: "El correo electrónico es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido"
              }
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="tu@correo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white mb-4 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>
  )
}