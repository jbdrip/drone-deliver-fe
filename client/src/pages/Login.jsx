import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { authLogin } from "../services/auth.service"
import { useUserData } from "../hooks/useAuth"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const navigate = useNavigate()
  const { login } = useUserData()

  const onSubmit = async (data) => {
    try {
      clearErrors("root")
      const loginRes = await authLogin({ 
        username: data.email, 
        password: data.password 
      })
      console.log("Login response:", loginRes)
      
      if(loginRes && loginRes.status === 'success') {
        // Guardar el token de acceso y al usuario en una cookie
        login(loginRes.data.user_data, loginRes.data.access_token)
        const userRole = loginRes.data.user_data.role
        navigate(userRole === 'admin' ? "/admin/users" : "/customer/orders")
      } else {
        setError("root", {
          type: "manual",
          message: loginRes.mensaje || "Error al iniciar sesión."
        })
      }
    } catch (err) {
      console.error(err)
      setError("root", {
        type: "manual",
        message: err.response?.data?.mensaje || "Error al iniciar sesión."
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4 text-center">Iniciar sesión</h2>
        
        <div className="my-4">
          {errors.root && (
            <p className="text-red-500 mb-3">{errors.root.message}</p>
          )}
          
          <label className="block text-gray-700">Correo electrónico</label>
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
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-9">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}