import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Info, Loader2, ShoppingCart, Banknote, Check, Box, MapPin, Navigation } from 'lucide-react'
import Modal from '../Modal'

export default function OrderForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  order = null, 
  products = [],
  isLoading = false 
}) {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm()

  const isEditing = !!order
  const watchedProductId = watch('product_id')
  const watchedUseClientLocation = watch('use_client_location')

  const modalTitle = isEditing ? 'Editar Pedido' : 'Nuevo Pedido'
  const modalSubtitle = isEditing 
    ? 'Actualiza la información del pedido' 
    : 'Completa los datos para registrar un nuevo pedido'

  // Encontrar el producto seleccionado
  const selectedProduct = products.find(product => product.id == watchedProductId)

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({ 
          product_id: order.product_id,
          use_client_location: order.use_client_location || true,
          latitude: order.latitude || '',
          longitude: order.longitude || ''
        })
      } else {
        reset({ 
          product_id: '',
          use_client_location: true,
          latitude: '',
          longitude: ''
        })
      }
    }
  }, [isOpen, order, isEditing, reset])

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
      <form id="order-form" onSubmit={handleSubmit(handleFormSubmit)} className=" space-y-6">

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          
          {/* Sección: Ubicación de Entrega */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Ubicación de Entrega</h3>
                <p className="text-sm text-gray-600">Selecciona la ubicación donde se realizará la entrega</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Opción de ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Ubicación *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={true}
                      {...register('use_client_location', { required: 'Debe seleccionar un tipo de ubicación' })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isLoading}
                    />
                    <div className="ml-3 flex items-center">
                      <div className="bg-blue-100 rounded-full p-1.5 mr-2">
                        <Navigation className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800">Usar ubicación del cliente</span>
                        <p className="text-xs text-gray-500">Se utilizará la ubicación registrada del cliente</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={false}
                      {...register('use_client_location', { required: 'Debe seleccionar un tipo de ubicación' })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isLoading}
                    />
                    <div className="ml-3 flex items-center">
                      <div className="bg-purple-100 rounded-full p-1.5 mr-2">
                        <MapPin className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800">Ingresar ubicación personalizada</span>
                        <p className="text-xs text-gray-500">Especificar coordenadas de latitud y longitud</p>
                      </div>
                    </div>
                  </label>
                </div>
                {errors.use_client_location && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.use_client_location.message}
                  </p>
                )}
              </div>

              {/* Campos de coordenadas (mostrar solo si se selecciona ubicación personalizada) */}
              {watchedUseClientLocation === 'false' && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitud *
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="Ej: 14.6349"
                        {...register('latitude', { 
                          required: watchedUseClientLocation === 'false' ? 'La latitud es requerida' : false,
                          min: { value: -90, message: 'La latitud debe estar entre -90 y 90' },
                          max: { value: 90, message: 'La latitud debe estar entre -90 y 90' }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                      />
                      {errors.latitude && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
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
                        placeholder="Ej: -90.5069"
                        {...register('longitude', { 
                          required: watchedUseClientLocation === 'false' ? 'La longitud es requerida' : false,
                          min: { value: -180, message: 'La longitud debe estar entre -180 y 180' },
                          max: { value: 180, message: 'La longitud debe estar entre -180 y 180' }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                      />
                      {errors.longitude && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          {errors.longitude.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-500 rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                        <Info className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">Información sobre coordenadas</p>
                        <p className="text-xs text-blue-700">
                          Las coordenadas deben estar en formato decimal. Por ejemplo, para Guatemala City: 
                          Latitud: 14.6349, Longitud: -90.5069
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador cuando se usa ubicación del cliente */}
              {watchedUseClientLocation === 'true' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-1 mr-2">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-800 font-medium">Ubicación del cliente seleccionada</p>
                      <p className="text-xs text-green-700 mt-1">
                        Se utilizará la dirección registrada en el perfil del cliente
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección: Productos */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Box className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
                <p className="text-sm text-gray-600">Selección del producto a comprar</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Campo de selección de producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto *
                </label>
                <select
                  {...register('product_id', { 
                    required: 'El producto es requerido'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Seleccione un producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.description} (Q{product.price})
                    </option>
                  ))}
                </select>
                {errors.product_id && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.product_id.message}
                  </p>
                )}
              </div>

              {/* Información del producto seleccionado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información del Producto
                </label>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  {selectedProduct ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                          <Box className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Nombre del Producto</p>
                          <p className="text-sm text-gray-900 font-semibold">{selectedProduct.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-yellow-100 rounded-full p-2 flex-shrink-0">
                          <Info className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Descripción</p>
                          <p className="text-sm text-gray-900">{selectedProduct.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                          <Banknote className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Precio Base</p>
                          <p className="text-lg font-bold text-green-600">Q{selectedProduct.price}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            * Este no es el precio final. El costo total variará según el costo de entrega.
                          </p>
                        </div>
                      </div>
                      
                      {/* Indicador visual de producto seleccionado */}
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-green-500 rounded-full p-1 mr-2">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-sm text-green-800 font-medium">Producto seleccionado correctamente</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">No hay producto seleccionado</p>
                      <p className="text-xs text-gray-500">Seleccione un producto del menú para ver su información detallada</p>
                    </div>
                  )}
                </div>
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
              form="order-form"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Guardando...
                </div>
              ) : (
                isEditing ? 'Actualizar Pedido' : 'Crear Pedido'
              )}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}