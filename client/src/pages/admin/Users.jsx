import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/DataTable'
import UserFormModal from '../../components/forms/UserForm'
import Tooltip from '../../components/Tooltip'
import { getUsers, createUser, updateUser, deactivateUser } from '../../services/user.service'
import { Edit, UserX, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../../components/ConfirmDialog'
import { useUserData } from '../../hooks/useAuth'

export default function Users() {
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()
  const { userId } = useUserData()

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getUsers(currentPage, itemsPerPage, searchTerm)
      if (response.status === 'success' && response.data) {
        setUsers(response.data.users || [])
        setTotalUsers(response.data.total || 0)
      } else {
        console.error('Error fetching users:', response.message)
        setUsers([])
        setTotalUsers(0)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
      setTotalUsers(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = user => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDeactivateUser = async (user) => {
    showDialog({
      title: "Desactivar Usuario",
      message: `¿Estás seguro de que deseas desactivar al usuario "${user.full_name}"?\n Una vez desactivado, no podrá reactivar su cuenta.`,
      confirmText: "Desactivar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          // Validate that the deactivated user is not the currently logged-in user
          if (userId && userId === user.id)
            return toast.error('No puedes desactivar tu propio usuario.')

          const response = await deactivateUser(user.id)
          if (response.status === 'success') {
            fetchUsers() // Refresh the list
            toast.success(`Usuario "${user.full_name}" desactivado exitosamente.`)
          } else {
            console.error('Error deactivating user:', response.message)
            toast.error(`Error al desactivar usuario: ${response.message}`)
          }
        } catch (error) {
          console.error('Error deactivating user:', error)
          toast.error('Error al desactivar usuario')
        }
      }
    });
  }

  const handleFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response
      const {  name, ...rest } = formData
      const user = { full_name: name, ...rest }

      if (selectedUser) {
        // Editing existing user
        response = await updateUser(selectedUser.id, user)
      } else {
        // Creating new user
        response = await createUser(user)
      }

      if (response.status === 'success') {
        setIsModalOpen(false)
        fetchUsers() // Refresh the list
        toast.success(`Usuario ${selectedUser ? 'actualizado' : 'creado'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.message)
        toast.error(`Error al ${selectedUser ? 'actualizar' : 'crear'} usuario: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedUser ? 'actualizar' : 'crear'} usuario: ${error.message || 'Error desconocido'}`)
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
      header: 'Rol',
      key: 'role',
      width: 'w-32', // Fixed width for role
      render: (user) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
          <Tooltip text="Editar usuario">
            <button
              onClick={() => handleEditUser(user)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Editar usuario"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          {user.is_active && (
            <Tooltip text="Desactivar usuario">
              <button
                onClick={() => handleDeactivateUser(user)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Desactivar usuario"
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
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button
          onClick={handleCreateUser}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <UserPlus size={16} />
          <span>Crear Usuario</span>
          
        </button>
      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={users}
          totalItems={totalUsers}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar usuarios por nombre o email..."
          isLoading={isLoading}
        />
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}