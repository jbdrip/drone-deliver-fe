import { useState, useEffect, useCallback } from 'react'
import DataTable from '../components/DataTable'
import DistributionCenterForm from '../components/forms/DistributionCenterForm'
import Tooltip from '../components/Tooltip'
import { getDistributionCenters, createDistributionCenter, updateDistributionCenter, deactivateDistributionCenter } from '../services/distributionCenter.service'
import { Edit, UserX, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../components/ConfirmDialog'


export default function DistributionCenters() {

  const [distributionCenters, setDistributionCenters] = useState([])
  const [totalDistributionCenters, setTotalDistributionCenters] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDistributionCenter, setSelectedDistributionCenter] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()

  const fetchDistributionCenters = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getDistributionCenters(currentPage, itemsPerPage, searchTerm)

      console.log('Distribution Centers Response:', response)
      if (response.status === 'success' && response.data) {
        setDistributionCenters(response.data.distribution_centers || [])
        setTotalDistributionCenters(response.data.total || 0)
      } else {
        console.error('Error fetching distributionCenters:', response.message)
        setDistributionCenters([])
        setTotalDistributionCenters(0)
      }
    } catch (error) {
      console.error('Error fetching distributionCenters:', error)
      setDistributionCenters([])
      setTotalDistributionCenters(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchDistributionCenters()
  }, [fetchDistributionCenters])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateDistributionCenter = () => {
    setSelectedDistributionCenter(null)
    setIsModalOpen(true)
  }

  const handleEditDistributionCenter = user => {
    setSelectedDistributionCenter(user)
    setIsModalOpen(true)
  }

  const handleDeactivateDistributionCenter = async (distributionCenter) => {
    showDialog({
      title: "Eliminar Central de Distribución",
      message: `¿Estás seguro de que deseas eliminar a la central de distribución "${distributionCenter.name}"?\n Una vez eliminada, no podrá recuperar sus datos.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await deactivateDistributionCenter(distributionCenter.id)
          if (response.status === 'success') {
            fetchDistributionCenters() // Refresh the list
            toast.success(`Central de distribución "${distributionCenter.name}" eliminada exitosamente.`)
          } else {
            console.error('Error deleting distributionCenter:', response.message)
            toast.error(`Error al eliminar central de distribución: ${response.message}`)
          }
        } catch (error) {
          console.error('Error deleting distributionCenter:', error)
          toast.error('Error al eliminar central de distribución')
        }
      }
    });
  }

  const handleFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response

      if (selectedDistributionCenter) {
        // Editing existing distributionCenter
        response = await updateDistributionCenter(selectedDistributionCenter.id, formData)
      } else {
        // Creating new distributionCenter
        response = await createDistributionCenter(formData)
      }

      if (response.status === 'success') {
        setIsModalOpen(false)
        fetchDistributionCenters() // Refresh the list
        toast.success(`Central de distribución ${selectedDistributionCenter ? 'actualizada' : 'creada'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.message)
        toast.error(`Error al ${selectedDistributionCenter ? 'actualizar' : 'crear'} central de distribución: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedDistributionCenter ? 'actualizar' : 'crear'} central de distribución: ${error.message || 'Error desconocido'}`)
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
      header: 'Alcance Máximo',
      key: 'max_drone_range',
      width: 'w-24', // Fixed width for max drone range
      render: (distributionCenter) => (
        <span className="whitespace-nowrap">
          {distributionCenter.max_drone_range.toLocaleString('es-ES')} km
        </span>
      )
    },
    {
      header: 'Estado',
      key: 'is_active',
      width: 'w-24', // Fixed width for status
      render: (user) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
          user.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? 'ACTIVO' : 'INACTIVO'}
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
              onClick={() => handleEditDistributionCenter(user)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Editar cliente"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          {user.is_active && (
            <Tooltip text="Eliminar cliente">
              <button
                onClick={() => handleDeactivateDistributionCenter(user)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Eliminar cliente"
              >
                <UserX size={16} />
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
        <h1 className="text-2xl font-bold text-gray-900">Centrales de Distribución</h1>
        <button
          onClick={handleCreateDistributionCenter}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <UserPlus size={16} />
          <span>Crear Central</span>
        </button>
      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={distributionCenters}
          totalItems={totalDistributionCenters}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar centrales por nombre, dirección o tipo..."
          isLoading={isLoading}
        />
      </div>

      <DistributionCenterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        distributionCenter={selectedDistributionCenter}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}