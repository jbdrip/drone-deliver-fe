import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Info, Loader2, BanknoteArrowUp } from 'lucide-react'
import Modal from '../Modal'
import Cookies from 'js-cookie'

export default function TransactionForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customer = null, 
  isLoading = false 
}) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const modalTitle = 'Gestión de Créditos'
  const modalSubtitle = 'Complete los datos de la transacción para asignar o desasignar créditos al cliente'

  useEffect(() => {
    if (isOpen && customer) {
      // Get the credited user ID from cookies or any other source
      const userCookie = Cookies.get('usuario')
      // Reset the form with customer data and default values
      reset({
        customer_id: customer.id,
        credited_by_user_id: userCookie ? JSON.parse(userCookie).id : 0,
        amount: 0, // Default amount to 0
        transaction_type: 'credit' // Default transaction type
      })
    }
  }, [isOpen, customer, reset])

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
      maxWidth="max-w-2xl"
      isLoading={isLoading}
    >
      <form id="transaction-form" onSubmit={handleSubmit(handleFormSubmit)} className=" space-y-6">

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          {/* Sección: Asignación de créditos */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <BanknoteArrowUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Datos de la Transacción</h3>
                <p className="text-sm text-gray-600">Tipo de operación y monto de créditos </p>
              </div>
            </div>

            {/* Transaction Type */}
            <div className="mt-6 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Operación *
              </label>
              <select
                {...register('transaction_type', { required: 'Seleccione un tipo de transacción' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              >
                <option value="credit">ASIGNACIÓN DE CRÉDITOS</option>
                <option value="debit">DESASIGNACIÓN DE CRÉDITOS</option>
              </select>
              {errors.transaction_type && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {errors.transaction_type.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className='my-2'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto(Q) *
              </label>
              <input
                type="number"
                min={0}
                {...register('amount', { 
                  required: 'El monto es requerido',
                  min: {
                    value: 0.01,
                    message: 'El monto debe ser mayor a 0'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: 50"
                disabled={isLoading}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {errors.amount.message}
                </p>
              )}
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
              form="transaction-form"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Guardando...
                </div>
              ) : (
                'Realizar Transacción'
              )}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}