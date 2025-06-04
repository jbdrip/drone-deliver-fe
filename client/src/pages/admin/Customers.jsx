import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/DataTable'
import CustomerForm from '../../components/forms/CustomerForm'
import Tooltip from '../../components/Tooltip'
import { getCustomers, createCustomer, updateCustomer, deactivateCustomer } from '../../services/customer.service'
import { CreditCard, Edit, Trash } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../../components/ConfirmDialog'
import TransactionForm from '../../components/forms/TransactionForm'
import { createTransaction } from '../../services/transaction.service'


export default function Customers() {

  const [customers, setCustomers] = useState([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomerModalOpen, setIsCustomerOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getCustomers(currentPage, itemsPerPage, searchTerm)
      if (response.status === 'success' && response.data) {
        setCustomers(response.data.customers || [])
        setTotalCustomers(response.data.total || 0)
      } else {
        console.error('Error fetching customers:', response.message)
        setCustomers([])
        setTotalCustomers(0)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
      setTotalCustomers(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateCustomer = () => {
    setSelectedCustomer(null)
    setIsCustomerOpen(true)
  }

  const handleEditCustomer = user => {
    setSelectedCustomer(user)
    setIsCustomerOpen(true)
  }

  const handleAssignCredits = async (customer) => {
    setSelectedCustomer(customer)
    setIsTransactionOpen(true)
  }

  const handleDeactivateCustomer = async (customer) => {
    showDialog({
      title: "Eliminar Cliente",
      message: `¿Estás seguro de que deseas eliminar al cliente "${customer.full_name}"?\n Una vez eliminado, no podrá recuperar sus datos.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await deactivateCustomer(customer.id)
          if (response.status === 'success') {
            fetchCustomers() // Refresh the list
            toast.success(`Cliente "${customer.full_name}" eliminado exitosamente.`)
          } else {
            console.error('Error deleting customer:', response.message)
            toast.error(`Error al eliminar cliente: ${response.message}`)
          }
        } catch (error) {
          console.error('Error deleting customer:', error)
          toast.error('Error al eliminar cliente')
        }
      }
    });
  }

  const handleCustomerFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response
      const {  name, ...rest } = formData
      const customer = { ...rest, full_name: name }

      if (selectedCustomer) {
        // Editing existing customer
        response = await updateCustomer(selectedCustomer.id, customer)
      } else {
        // Creating new customer
        response = await createCustomer(customer)
      }

      if (response.status === 'success') {
        setIsCustomerOpen(false)
        fetchCustomers() // Refresh the list
        toast.success(`Cliente ${selectedCustomer ? 'actualizado' : 'creado'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.message)
        toast.error(`Error al ${selectedCustomer ? 'actualizar' : 'crear'} cliente: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedCustomer ? 'actualizar' : 'crear'} cliente: ${error.message || 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTransactionFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      const response = await createTransaction(formData)
      if (response.status === 'success') {
        setIsTransactionOpen(false)
        fetchCustomers() // Refresh the list
        toast.success(response.message || 'Transacción realizada exitosamente.')
      } else {
        console.error('Error submitting transaction:', response.message)
        toast.error(`Error al crear transacción: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting transaction:', error)
      toast.error(`Error al crear transacción: ${error.message || 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'Nombre',
      key: 'full_name',
      width: 'min-w-32', // Minimum width, can grow
    },
    {
      header: 'Email',
      key: 'email',
      width: 'min-w-48', // Minimum width for email
    },
    {
      header: 'Teléfono',
      key: 'phone',
      width: 'min-w-32', // Minimum width for phone
      render: (user) => (
        <span className="whitespace-nowrap">
          {user.phone || 'No disponible'}
        </span>
      )
    },
    {
      header: 'Dirección',
      key: 'address',
      width: 'min-w-48', // Minimum width for address
    },
    {
      header: 'Latitud',
      key: 'latitude',
      width: 'w-32', // Fixed width for latitude
    },
    {
      header: 'Longitud',
      key: 'longitude',
      width: 'w-32', // Fixed width for longitude
    },
    {
      header: 'Créditos',
      key: 'credit_balance',
      width: 'w-24', // Fixed width for credits
      render: (user) => (
        <span className="whitespace-nowrap">
          Q {user.credit_balance ? user.credit_balance.toLocaleString('es-ES') : '0'}
        </span>
      )
    },
    {
      header: 'Fecha de Creación',
      key: 'created_at',
      width: 'w-32', // Fixed width for date
      render: (user) => (
        <span className="whitespace-nowrap">
          {new Date(user.created_at).toLocaleDateString('es-ES')}
        </span>
      )
    },
    {
      header: 'Acciones',
      key: 'actions',
      width: 'w-40', // Fixed width for actions
      render: (user) => (
        <div className="flex space-x-2 whitespace-nowrap">
          <Tooltip text="Editar cliente">
            <button
              onClick={() => handleEditCustomer(user)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Editar cliente"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          {user.is_active && (
            <Tooltip text="Gestionar créditos">
              <button
                onClick={() => handleAssignCredits(user)}
                className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                aria-label="Gestionar créditos"
              >
                <CreditCard size={16} />
              </button>
            </Tooltip>
          )}
          {user.is_active && (
            <Tooltip text="Eliminar cliente">
              <button
                onClick={() => handleDeactivateCustomer(user)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Eliminar cliente"
              >
                <Trash size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="h-full flex flex-col">

      {/* Header - Fixed height */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>

      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={customers}
          totalItems={totalCustomers}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar clientes por nombre, email, teléfono o dirección..."
          isLoading={isLoading}
        />
      </div>

      <CustomerForm
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerOpen(false)}
        onSubmit={handleCustomerFormSubmit}
        customer={selectedCustomer}
        isLoading={isSubmitting}
      />

      <TransactionForm
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionOpen(false)}
        onSubmit={handleTransactionFormSubmit}
        customer={selectedCustomer}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}