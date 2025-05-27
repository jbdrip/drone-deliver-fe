import { FaUserCircle } from 'react-icons/fa'
import { Menu, MenuItem } from '@headlessui/react'
import Cookies from 'js-cookie'
import logo from '../assets/react.svg'
import { FaSignOutAlt } from 'react-icons/fa'


export default function TopBar() {

  const handleLogout = () => {
    Cookies.remove('access_token')
    Cookies.remove('usuario')
    window.location.href = '/'
  }

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 shadow">
      <img src={logo} alt="Logo" className="h-10" />
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="text-2xl">
          <FaUserCircle />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-gray-100' : ''
                } w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2`}
              >
                <FaSignOutAlt className="h-4 w-4" />
                Cerrar sesión
              </button>
            )}
          </MenuItem>
        </Menu.Items>
      </Menu>
    </div>
  )
}