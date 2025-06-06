import { useState, useEffect, useCallback, useRef } from 'react'
import DataTable from '../components/DataTable'
import OrderForm from '../components/forms/OrderForm'
import OrderSummary from '../components/pages/orders/OrderSummary'
import RoutePreview from '../components/pages/orders/RoutePreview'
import Tooltip from '../components/Tooltip'
import { getOrders, createOrder, updateOrder, cancelOrder, confirmOrder, deliverOrder } from '../services/order.service'
import { CirclePlus, Edit, Route, Trash } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../components/ConfirmDialog'
import { getProducts } from '../services/product.service'
import { useUserData } from '../hooks/useAuth'
import { getCustomerByCurrentUser } from '../services/customer.service'

const statusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmado', color: 'blue' },
  { value: 'in_transit', label: 'En Tránsito', color: 'gray' },
  { value: 'delivered', label: 'Entregado', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' }
]

export default function Orders() {

  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customer, setCustomer] = useState(null)
  const [totalOrders, setTotalOrders] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOrderModalOpen, setIsOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10
  
  // Ref para evitar múltiples llamadas simultáneas
  const fetchingRef = useRef(false)

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()
  const { userData } = useUserData() // Asumiendo que tienes un hook para obtener datos del usuario

  const fetchOrders = async (page = currentPage, search = searchTerm) => {
    // Prevenir múltiples llamadas simultáneas
    if (fetchingRef.current) return
    fetchingRef.current = true
    setIsLoading(true)
    try {
      const response = await getOrders(page, itemsPerPage, search)
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
      fetchingRef.current = false
    }
  }

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts()
      if (response.status === 'success' && response.data) {
        setProducts(response.data.products || [])
      } else {
        console.error('Error fetching products:', response.detail)
        setProducts([])
        toast.error(`Error al obtener productos: ${response.detail}`)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      toast.error('Error al obtener productos')
    }
  }, [])

  const getCustomerCurrentUser = useCallback(async () => {
    try {
      const response = await getCustomerByCurrentUser()
      if (response.status === 'success' && response.data) {
        setCustomer(response.data)
      } else {
        console.error('Error fetching client:', response.detail)
        setCustomer(null)
        toast.error(`Error al obtener cliente: ${response.detail}`)
      }
    } catch (error) {
      console.error('Error fetching client:', error)
      setCustomer(null)
      toast.error('Error al obtener cliente')
    }
  }, [])

  // Efecto para cargar órdenes inicialmente
  useEffect(() => {
    fetchOrders()
  }, []) // Solo se ejecuta una vez al montar el componente

  // Efecto separado para cuando cambian la página o búsqueda
  useEffect(() => {
    fetchOrders(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  // Efecto para cargar productos
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Efecto para cargar cliente actual
  useEffect(() => {
    if (userData?.role === 'customer') {
      getCustomerCurrentUser()
    }
  }, [userData, getCustomerCurrentUser])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = (search) => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateOrder = () => {
    setSelectedOrder(null)
    setIsOrderOpen(true)
  }

  const handleEditOrder = (user) => {
    setSelectedOrder(user)
    setIsOrderOpen(true)
  }

  const handleConfirmOrder = async (order) => {
    // Obtener la informacion de la ruta en base al pedido
    const routeInfo = order.delivery_route.map(stop => stop.center_name).join(' -> ')
    showDialog({
      title: "Confirmar Pedido",
      message: <OrderSummary orderData={order} routeInfo={routeInfo} />,
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      type: "info",
      width: 'max-w-2xl',
      height: 'max-h-96 lg:max-h-[60vh]',
      onConfirm: async () => {
        try {
          const response = await confirmOrder(order.id)
          if (response.status === 'success') {
            getCustomerCurrentUser() // Refresh customer data
            fetchOrders() // Refresh the orders list
            setSelectedOrder(null) // Reset selected order after confirmation
            toast.success(response.message || `Pedido "${order.id}" confirmado exitosamente.`)
          } else {
            console.error('Error confirming order:', response.detail)
            toast.error(`Error al confirmar pedido: ${response.detail}`)
          }
        } catch (error) {
          console.error('Error confirming order:', error)
          toast.error('Error al confirmar pedido')
        }
      }
    });
  }

  const handleDeliverOrder = async (order) => {
    showDialog({
      title: "Marcar como Entregado",
      message: `¿Estás seguro de que deseas marcar el pedido: "${order.id}" como entregado?`,
      confirmText: "Marcar como Entregado",
      cancelText: "Cerrar",
      type: "info",
      onConfirm: async () => {
        try {
          const response = await deliverOrder(order.id)
          if (response.status === 'success') {
            fetchOrders() // Refresh the list
            toast.success(response.message || `Pedido "${order.id}" marcado como entregado exitosamente.`)
          } else {
            console.error('Error confirming order:', response.detail)
            toast.error(`Error al marcar pedido como entregado: ${response.detail}`)
          }
        } catch (error) {
          console.error('Error confirming order:', error)
          toast.error('Error al marcar pedido como entregado')
        }
      }
    });
  }

  const handleRoutePreview = (order) => {
    showDialog({
      title: 'Ruta de Envío',
      message: <RoutePreview orderData={order} />,
      confirmText: 'Cerrar',
      cancelText: 'Cancelar',
      type: 'info',
      width: 'max-w-3xl',
      height: 'max-h-96 lg:max-h-full',
      onConfirm: () => {
        setSelectedOrder(null) // Reset selected order after preview
      }
    });
  }

  const handleCancelOrder = async (order) => {
    showDialog({
      title: "Cancelar Pedido",
      message: `¿Estás seguro de que deseas cancelar el pedido: "${order.id}"?\n Una vez cancelado no podrás realizar cambios.`,
      confirmText: "Cancelar Pedido",
      cancelText: "Cerrar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await cancelOrder(order.id, { cancellation_reason: 'Pedido cancelado por el cliente' })
          if (response.status === 'success') {
            fetchOrders() // Refresh the list
            toast.success(response.message || `Orden "${order.id}" eliminado exitosamente.`)
          } else {
            console.error('Error cancelling order:', response.detail)
            toast.error(`Error al cancelar orden: ${response.detail}`)
          }
        } catch (error) {
          console.error('Error cancelling order:', error)
          toast.error('Error al cancelar pedido')
        }
      }
    });
  }

  const handleOrderFormSubmit = async (formData) => {
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
      if (response.status === 'success') {
        setIsOrderOpen(false)
        toast.success(response.message)
        fetchOrders() // Refresh the list
        handleConfirmOrder(response.data.order) // Show confirmation dialog with order details
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

  const columns = [
    {
      header: 'ID Orden',
      key: 'id',
      width: 'w-24', // Fixed width for ID
    },
    {
      header: 'Central Asignada',
      key: 'assigned_distribution_center_name',
      width: 'min-w-48', // Minimum width for assigned distribution center
    },
    {
      header: 'Producto',
      key: 'product_name',
      width: 'min-w-48', // Minimum width for product name
    },
    {
      header: 'Distancia Total (km)',
      key: 'total_distance',
      width: 'w-32', // Fixed width for total distance
      render: (user) => (
        <span className="whitespace-nowrap">
          {user.total_distance ? user.total_distance.toLocaleString('es-ES') : '0'} km
        </span>
      )
    },
    {
      header: 'Costo Producto',
      key: 'product_cost',
      width: 'w-32', // Fixed width for product cost
      render: (user) => (
        <span className="whitespace-nowrap">
          Q {user.product_cost ? user.product_cost.toLocaleString('es-ES') : '0'}
        </span>
      )
    },
    {
      header: 'Costo Servicio',
      key: 'service_cost',
      width: 'w-32', // Fixed width for service cost
      render: (user) => (
        <span className="whitespace-nowrap">
          Q {user.service_cost ? user.service_cost.toLocaleString('es-ES') : '0'}
        </span>
      )
    },
    {
      header: 'Costo Total',
      key: 'total_cost',
      width: 'w-32', // Fixed width for total cost
      render: (user) => (
        <span className="whitespace-nowrap">
          Q {user.total_cost ? user.total_cost.toLocaleString('es-ES') : '0'}
        </span>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      width: 'w-24', // Fixed width for status
      render: (user) => {
        const status = statusOptions.find(s => s.value === user.status_name)
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-${status.color}-100 text-${status.color}-800`}>
            {status.label}
          </span>
        )
      }
    },
    {
      header: 'Tiempo Estimado (min)',
      key: 'estimated_delivery_time',
      width: 'w-32', // Fixed width for estimated delivery time
      render: (user) => (
        <span className="whitespace-nowrap">
          {user.estimated_delivery_time ? user.estimated_delivery_time.toLocaleString('es-ES') : '0'} min
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
      render: (order) => (
        <div className="flex space-x-2 whitespace-nowrap">
          {userData.role === 'customer' && order.status_name === 'pending' && (
            <>
              <Tooltip text="Confirmar pedido">
                <button
                  onClick={() => handleConfirmOrder(order)}
                  className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  aria-label="Confirmar pedido"
                >
                  <CirclePlus size={16} />
                </button>
              </Tooltip>
              <Tooltip text="Editar pedido">
                <button
                  onClick={() => handleEditOrder(order)}
                  className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Editar pedido"
                >
                  <Edit size={16} />
                </button>
              </Tooltip>
              <Tooltip text="Cancelar pedido">
                <button
                  onClick={() => handleCancelOrder(order)}
                  className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Cancelar pedido"
                >
                  <Trash size={16} />
                </button>
              </Tooltip>
            </>
          )}
          {userData.role === 'admin' && (
            <>
              {order.status_name === 'confirmed' && (
                <Tooltip text="Marcar como entregado">
                  <button
                    onClick={() => handleDeliverOrder(order)}
                    className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    aria-label="Marcar como entregado"
                  >
                    <CirclePlus size={16} />
                  </button>
                </Tooltip>
              )}
              {order.status_name === 'pending' && (
                <Tooltip text="Cancelar pedido">
                  <button
                    onClick={() => handleCancelOrder(order)}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    aria-label="Cancelar pedido"
                  >
                    <Trash size={16} />
                  </button>
                </Tooltip>
              )}
            </>
          )}
          <Tooltip text="Ver ruta">
            <button
              onClick={() => handleRoutePreview(order)}
              className="p-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              aria-label="Ver ruta"
            >
              <Route size={16} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  // Si el usuario es administrador, agregar columna de cliente luego del ID de orden
  if (userData?.role === 'admin') {
    columns.splice(1, 0, {
      header: 'Cliente',
      key: 'customer_name',
      width: 'min-w-48', // Minimum width for customer name
      render: (order) => (
        <span className="whitespace-nowrap">
          {order.customer_name || 'N/A'}
        </span>
      )
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed height */}
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 flex-shrink-0 ${userData?.role === 'customer' ? 'mb-4' : 'mb-6'}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userData?.role === 'customer' ? 'Mis' : ''} Pedidos</h1>
          {/* Mostrar el saldo del cliente */}
          {userData?.role === 'customer' && customer && (
            <div className="text-md text-green-600">
              Saldo disponible: <span className="font-semibold">Q {customer.credit_balance ? customer.credit_balance.toLocaleString('es-ES') : '0'}</span>
            </div>
          )}
        </div>
        
        {/* Botón para crear pedido */}
        {userData?.role === 'customer' && (
          <button
            onClick={handleCreateOrder}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            <CirclePlus size={16} />
            <span>Crear Pedido</span>
          </button>
        )}
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
          searchPlaceholder="Buscar pedidos por cliente, producto, central o estado..."
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

      <ConfirmDialogComponent />
    </div>
  )
}