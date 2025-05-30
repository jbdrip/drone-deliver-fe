import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, MapPin, Navigation, Info, Loader2, ShoppingCart, ListTodo } from 'lucide-react'
import Modal from '../Modal'

export default function ProductForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product = null, 
  isLoading = false 
}) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const isEditing = !!product

  const modalTitle = isEditing ? 'Editar Producto' : 'Nuevo Producto'
  const modalSubtitle = isEditing 
    ? 'Actualiza la información del producto' 
    : 'Completa los datos para registrar un nuevo producto'

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity
        })
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          stock_quantity: 0
        })
      }
    }
  }, [isOpen, product, isEditing, reset])

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
      <form id="client-form" onSubmit={handleSubmit(handleFormSubmit)} className=" space-y-6">

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          
          {/* Sección: Información General */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                <p className="text-sm text-gray-600">Datos básicos del producto</p>
              </div>
            </div>

            <div className="space-y-4">
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
                  placeholder="Ingrese el nombre del producto..."
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  {...register('description', {
                    maxLength: {
                      value: 500,
                      message: 'La descripción no puede exceder los 500 caracteres'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Ingrese la descripción del producto..."
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
          </div>

          <hr className="mt-6 mb-6 border-gray-200" />

          {/* Sección: Inventario */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <ListTodo className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Inventario</h3>
                <p className="text-sm text-gray-600">Precio y stock en la bodega central</p>
              </div>
            </div>

            {/* Precio y stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio(Q) *
                </label>
                <input
                  type="number"
                  min={0}
                  {...register('price', {
                    required: 'El precio es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor o igual a 0'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: 14.63"
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
                  Cantidad Disponible *
                </label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  {...register('stock_quantity', {
                    required: 'El stock es requerido',
                    min: {
                      value: 0,
                      message: 'El stock debe ser mayor o igual a 0'
                    },
                    validate: (value) => {
                      if (value % 1 !== 0) {
                        return 'El stock debe ser un número entero'
                      }
                      return true
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: 100"
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
              form="client-form"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Guardando...
                </div>
              ) : (
                isEditing ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}