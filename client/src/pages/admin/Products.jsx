import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/DataTable'
import ProductForm from '../../components/forms/ProductForm'
import Tooltip from '../../components/Tooltip'
import { getProducts, createProduct, updateProduct, deactivateProduct } from '../../services/product.service'
import { Edit, Trash, CirclePlus } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../../components/ConfirmDialog'


export default function Products() {

  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getProducts(currentPage, itemsPerPage, searchTerm)
      if (response.status === 'success' && response.data) {
        setProducts(response.data.products || [])
        setTotalProducts(response.data.total || 0)
      } else {
        console.error('Error fetching products:', response.message)
        setProducts([])
        setTotalProducts(0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setTotalProducts(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = user => {
    setSelectedProduct(user)
    setIsModalOpen(true)
  }

  const handleDeactivateProduct = async (product) => {
    showDialog({
      title: "Eliminar Producto",
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?\n Una vez eliminado, no podrá recuperar sus datos.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await deactivateProduct(product.id)
          if (response.status === 'success') {
            fetchProducts() // Refresh the list
            toast.success(`Producto "${product.full_name}" eliminado exitosamente.`)
          } else {
            console.error('Error deleting product:', response.message)
            toast.error(`Error al eliminar producto: ${response.message}`)
          }
        } catch (error) {
          console.error('Error deleting product:', error)
          toast.error('Error al eliminar producto')
        }
      }
    });
  }

  const handleFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response

      if (selectedProduct) {
        // Editing existing product
        response = await updateProduct(selectedProduct.id, formData)
      } else {
        // Creating new product
        response = await createProduct(formData)
      }

      if (response.status === 'success') {
        setIsModalOpen(false)
        fetchProducts() // Refresh the list
        toast.success(`Producto ${selectedProduct ? 'actualizado' : 'creado'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.message)
        toast.error(`Error al ${selectedProduct ? 'actualizar' : 'crear'} producto: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedProduct ? 'actualizar' : 'crear'} producto: ${error.message || 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'Nombre',
      key: 'name',
      width: 'min-w-32', // Minimum width, can grow
    },
    {
      header: 'Descripción',
      key: 'description',
      width: 'min-w-48', // Minimum width for description
      render: (user) => (
        <span className="whitespace-nowrap">
          {user.description || '- - - - - -'}
        </span>
      )
    },
    {
      header: 'Precio',
      key: 'price',
      width: 'w-24', // Fixed width for price
      render: (user) => (
        <span className="whitespace-nowrap">
          Q {user.price ? user.price.toLocaleString('es-ES') : '0'}
        </span>
      )
    },
    {
      header: 'Stock',
      key: 'stock_quantity',
      width: 'w-24', // Fixed width for stock
      render: (user) => (
        <span className="whitespace-nowrap">
          {user.stock_quantity ? user.stock_quantity : '0'}
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
          <Tooltip text="Editar producto">
            <button
              onClick={() => handleEditProduct(user)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Editar producto"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          {user.is_active && (
            <Tooltip text="Eliminar producto">
              <button
                onClick={() => handleDeactivateProduct(user)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Eliminar producto"
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
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button
          onClick={handleCreateProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <CirclePlus size={16} />
          <span>Crear Producto</span>
        </button>
      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={products}
          totalItems={totalProducts}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar productos por nombre o descripción..."
          isLoading={isLoading}
        />
      </div>

      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}