import { FaUserCircle, FaBars } from 'react-icons/fa'
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/react'
import logo from '../assets/drone-deliver-logo2.svg'
import { FaSignOutAlt } from 'react-icons/fa'
import { useUserData } from '../hooks/useAuth'

export default function TopBar({ isCollapsed, toggle }) {

  const { userName, userEmail, logout } = useUserData()

  const handleLogout = () => logout()

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 shadow-md relative z-30">
      {/* Left section with mobile toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
          <div className="hidden sm:block">
            <h1 className="font-semibold text-lg">Panel Administrativo</h1>
            <p className="text-blue-100 text-xs">Sistema de Gestión de Entregas con Drones</p>
          </div>
        </div>
      </div>

      {/* Right section with user menu */}
      <div className="flex items-center space-x-4">
        {/* Welcome message - hidden on small screens */}
        <div className="hidden md:block text-right">
          <p className="text-sm text-blue-100">Bienvenido</p>
          <p className="text-xs text-blue-200">{userName}</p>
        </div>

        {/* User menu */}
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaUserCircle className="text-2xl" />
            <span className="hidden sm:inline text-sm">Mi cuenta</span>
          </MenuButton>
          
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            
            <MenuItem>
              {({ focus }) => (
                <button
                  className={`${
                    focus ? 'bg-gray-100' : ''
                  } w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-3 transition-colors`}
                >
                  <FaUserCircle className="h-4 w-4 text-gray-400" />
                  Mi Perfil
                </button>
              )}
            </MenuItem>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    focus ? 'bg-red-50 text-red-700' : 'text-gray-700'
                  } w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors`}
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  Cerrar sesión
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}