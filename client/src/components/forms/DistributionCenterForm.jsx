import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Building, MapPin, Navigation, Info, Loader2 } from 'lucide-react'
import Modal from '../Modal'

export default function DistributionCenterForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  distributionCenter = null,
  isLoading = false
}) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const isEditing = !!distributionCenter

  const modalTitle = isEditing ? 'Editar Central de Distribución' : 'Nueva Central de Distribución'
  const modalSubtitle = isEditing 
    ? 'Actualiza la información de la central de distribución' 
    : 'Completa los datos para registrar una nueva central de distribución'

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          name: distributionCenter.name,
          address: distributionCenter.address,
          latitude: distributionCenter.latitude,
          longitude: distributionCenter.longitude,
          max_drone_range: distributionCenter.max_drone_range,
          center_type: distributionCenter.center_type
        })
      } else {
        reset({
          name: '',
          address: '',
          latitude: 0.0,
          longitude: 0.0,
          max_drone_range: 0,
          center_type: 'distribution_point'
        })
      }
    }
  }, [isOpen, distributionCenter, isEditing, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      maxWidth="max-w-4xl"
      isLoading={isLoading}
    >
      <form id="distribution-center-form" onSubmit={handleSubmit(handleFormSubmit)} className=" space-y-6">

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          
          {/* Sección: Información General */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                <p className="text-sm text-gray-600">Datos básicos de la central de distribución</p>
              </div>
            </div>

            <div className="space-y-4">

              <div className={`grid grid-cols-1 md:grid-cols-${isEditing ? '1' : '2'} gap-4`}>
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ingrese el nombre"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Tipo de Central - select con las opciones punto de distribucion o bodega central*/}
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Central *
                    </label>
                    <select
                      {...register('center_type', {
                        required: 'El tipo de central es requerido'
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="distribution_point">Punto de Distribución</option>
                      <option value="main_warehouse">Bodega Central</option>
                    </select>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
                
              </div>

              {/* Alcance máximo de los drones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alcance máximo de los drones (en kilómetros) *
                </label>
                <input
                  type='number'
                  {...register('max_drone_range', { 
                    required: 'El alcance máximo es requerido',
                    min: {
                      value: 1,
                      message: 'El alcance debe ser mayor a 0'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: 100"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="mt-9 mb-6 border-gray-200" />

          {/* Sección: Dirección */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Dirección</h3>
                <p className="text-sm text-gray-600">Ubicación física de la central de distribución</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa *
              </label>
              <textarea
                rows={3}
                {...register('address', { 
                  required: 'La dirección es requerida',
                  minLength: {
                    value: 5,
                    message: 'La dirección debe tener al menos 5 caracteres'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Ingrese la dirección completa de la central..."
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <hr className="mt-9 mb-8 border-gray-200" />

          {/* Sección: Coordenadas Geográficas */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <Navigation className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Coordenadas Geográficas</h3>
                <p className="text-sm text-gray-600">Ubicación GPS precisa para pedidos y servicios</p>
              </div>
            </div>

            <div className="mt-6 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 flex items-start">
                <Info className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Tip:</strong> Puedes obtener las coordenadas GPS usando Google Maps. 
                  Haz clic derecho en la ubicación y selecciona "¿Qué hay aquí?" para ver las coordenadas.
                </span>
              </p>
            </div>

            {/* Latitud y Longitud en la misma fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud *
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('latitude', { 
                    required: 'La latitud es requerida',
                    min: {
                      value: -90,
                      message: 'La latitud debe ser mayor o igual a -90'
                    },
                    max: {
                      value: 90,
                      message: 'La latitud debe ser menor o igual a 90'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: 14.6349"
                  disabled={isLoading}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud *
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('longitude', { 
                    required: 'La longitud es requerida',
                    min: {
                      value: -180,
                      message: 'La longitud debe ser mayor o igual a -180'
                    },
                    max: {
                      value: 180,
                      message: 'La longitud debe ser menor o igual a 180'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: -90.5069"
                  disabled={isLoading}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          
        </div>

        {/* Botones de acción */}
        <div className="flex-shrink-0 border-t border-gray-200 p-5">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="distribution-center-form"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Guardando...
                </div>
              ) : (
                isEditing ? 'Actualizar Central' : 'Crear Central'
              )}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}