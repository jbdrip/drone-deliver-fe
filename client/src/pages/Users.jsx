import { useState, useEffect, useCallback } from 'react'
import DataTable from '../components/DataTable'
import UserFormModal from '../components/modals/UserFormModal'
import { getUsers, createUser, updateUser, deactivateUser } from '../services/user.service'
import Cookies from "js-cookie"

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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getUsers(currentPage, itemsPerPage, searchTerm)
      console.log('Fetched users:', response)
      if (response.status === 'success' && response.data) {
        setUsers(response.data || [])
        setTotalUsers(response.data.length || 0)
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
    if (window.confirm(`¿Estás seguro de que deseas desactivar al usuario "${user.full_name}"?`)) {
      try {
        // Validate that the deactivated user is not the currently logged-in user
        const currentUser = JSON.parse(Cookies.get('usuario'))
        if (currentUser && currentUser.id === user.id)
          return alert('No puedes desactivar tu propio usuario.')

        const response = await deactivateUser(user.id)
        if (response.status === 'success') {
          fetchUsers() // Refresh the list
          alert('Usuario desactivado exitosamente')
        } else {
          alert('Error al desactivar usuario: ' + response.message)
        }
      } catch (error) {
        console.error('Error deactivating user:', error)
        alert('Error al desactivar usuario')
      }
    }
  }

  const handleFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response
      const {  name, email, password } = formData
      const user = { full_name: name, email, password }

      if (selectedUser) {
        // Editing existing user
        console.log('Updating user with data:', formData)
        response = await updateUser(selectedUser.id, user)
        console.log('Update user response:', response)
      } else {
        // Creating new user
        console.log('Creating user with data:', formData)
        response = await createUser(user)
        console.log('Create user response:', response)
      }

      if (response.status === 'success') {
        setIsModalOpen(false)
        fetchUsers() // Refresh the list
        alert(selectedUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente')
      } else {
        alert('Error: ' + response.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al guardar usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'ID',
      key: 'id',
      width: 'w-16', // Fixed width for ID
    },
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
          <button
            onClick={() => handleEditUser(user)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Editar
          </button>
          {user.is_active && (
            <button
              onClick={() => handleDeactivateUser(user)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Desactivar
            </button>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          + Agregar Usuario
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
    </div>
  )
}