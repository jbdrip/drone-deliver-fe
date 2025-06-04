import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/DataTable'
import OrderForm from '../../components/forms/OrderForm'
import Tooltip from '../../components/Tooltip'
import { getOrders, createOrder, updateOrder, deactivateOrder } from '../../services/order.service'
import { CirclePlus, CreditCard, Edit, Trash } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../../components/ConfirmDialog'
import TransactionForm from '../../components/forms/TransactionForm'
import { createTransaction } from '../../services/transaction.service'
import { getProducts } from '../../services/product.service'
import { useUserData } from '../../hooks/useAuth'


export default function Orders() {

  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOrderModalOpen, setIsOrderOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()
  const { userId } = useUserData()

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getOrders(currentPage, itemsPerPage, searchTerm)
      if (response.status === 'success' && response.data) {
        setOrders(response.data.orders || [])
        setTotalOrders(response.data.total || 0)
      } else {
        console.error('Error fetching orders:', response.message)
        setOrders([])
        setTotalOrders(0)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
      setTotalOrders(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts()
      if (response.status === 'success' && response.data) {
        setProducts(response.data.products || [])
      } else {
        console.error('Error fetching products:', response.message)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [fetchOrders, fetchProducts])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateOrder = () => {
    setSelectedOrder(null)
    setIsOrderOpen(true)
  }

  const handleEditOrder = user => {
    setSelectedOrder(user)
    setIsOrderOpen(true)
  }

  const handleAssignCredits = async (order) => {
    setSelectedOrder(order)
    setIsTransactionOpen(true)
  }

  const handleDeactivateOrder = async (order) => {
    showDialog({
      title: "Eliminar Cliente",
      message: `¿Estás seguro de que deseas eliminar al cliente "${order.full_name}"?\n Una vez eliminado, no podrá recuperar sus datos.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await deactivateOrder(order.id)
          if (response.status === 'success') {
            fetchOrders() // Refresh the list
            toast.success(`Cliente "${order.full_name}" eliminado exitosamente.`)
          } else {
            console.error('Error deleting order:', response.message)
            toast.error(`Error al eliminar cliente: ${response.message}`)
          }
        } catch (error) {
          console.error('Error deleting order:', error)
          toast.error('Error al eliminar cliente')
        }
      }
    });
  }

  const handleOrderFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response
      const order = { ...formData, quantity: 1 }

      if (selectedOrder) {
        // Editing existing order
        response = await updateOrder(selectedOrder.id, order)
      } else {
        // Creating new order
        response = await createOrder(order)
      }

      console.log('Order response:', response)

      if (response.status === 'success') {
        setIsOrderOpen(false)
        fetchOrders() // Refresh the list
        toast.success(`Orden ${selectedOrder ? 'actualizada' : 'creada'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.detail)
        toast.error(response.detail)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedOrder ? 'actualizar' : 'crear'} orden: ${error.message || 'Error desconocido'}`)
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
        fetchOrders() // Refresh the list
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
              onClick={() => handleEditOrder(user)}
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
                onClick={() => handleDeactivateOrder(user)}
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
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
        <button
          onClick={handleCreateOrder}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <CirclePlus size={16} />
          <span>Crear Pedido</span>
        </button>
      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={orders}
          totalItems={totalOrders}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar clientes por nombre, email, teléfono o dirección..."
          isLoading={isLoading}
        />
      </div>

      <OrderForm
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderOpen(false)}
        onSubmit={handleOrderFormSubmit}
        order={selectedOrder}
        products={products}
        isLoading={isSubmitting}
      />

      <TransactionForm
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionOpen(false)}
        onSubmit={handleTransactionFormSubmit}
        order={selectedOrder}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}