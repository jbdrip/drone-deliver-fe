import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { authRegister } from "../services/auth.service"

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      latitude: "",
      longitude: ""
    }
  })

  const navigate = useNavigate()
  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      clearErrors("root")
      
      // Registrar usuario
      const userRegisterRes = await authRegister({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      })

      if(userRegisterRes && userRegisterRes.status === 'success') {
        // Registro exitoso, redirigir al login
        navigate("/login", { 
            state: { 
              message: "Registro exitoso. Por favor, inicia sesión." 
            } 
          })
      } else {
        setError("root", {
          type: "manual",
          message: userRegisterRes.mensaje || "Error al registrar el usuario o cliente."
        })
      }
    } catch (err) {
      console.error(err)
      setError("root", {
        type: "manual",
        message: err.response?.data?.mensaje || "Error en el registro."
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl mb-6 text-center">Crear cuenta</h2>
        
        {errors.root && (
          <div className="mb-4">
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          </div>
        )}

        {/* Nombre completo */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            {...register("full_name", {
              required: "El nombre completo es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              }
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email y Teléfono */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ingresa un correo electrónico válido"
                }
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "El teléfono es requerido",
                pattern: {
                  value: /^[\d\s\-\+\(\)]+$/,
                  message: "Ingresa un número de teléfono válido"
                }
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: +502 1234-5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Contraseña y Confirmar contraseña */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: value =>
                  value === password || "Las contraseñas no coinciden"
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Latitud
            </label>
            <input
              type="number"
              step="any"
              {...register("latitude", {
                required: "La latitud es requerida",
                min: {
                  value: -90,
                  message: "Latitud debe estar entre -90 y 90"
                },
                max: {
                  value: 90,
                  message: "Latitud debe estar entre -90 y 90"
                }
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.latitude ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="14.6349"
            />
            {errors.latitude && (
              <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Longitud
            </label>
            <input
              type="number"
              step="any"
              {...register("longitude", {
                required: "La longitud es requerida",
                min: {
                  value: -180,
                  message: "Longitud debe estar entre -180 y 180"
                },
                max: {
                  value: 180,
                  message: "Longitud debe estar entre -180 y 180"
                }
              })}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.longitude ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="-90.5069"
            />
            {errors.longitude && (
              <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Dirección
          </label>
          <textarea
            {...register("address", {
              required: "La dirección es requerida",
              minLength: {
                value: 10,
                message: "La dirección debe ser más específica"
              }
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            rows="2"
            placeholder="Ingresa tu dirección completa"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white font-medium ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Registrando..." : "Crear cuenta"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}