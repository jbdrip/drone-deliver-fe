import { NavLink } from 'react-router-dom'
import { FaBars, FaTachometerAlt, FaChartBar } from 'react-icons/fa'

export default function Sidebar({ isCollapsed, toggle }) {
  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full shadow bg-white border border-gray-300"
        onClick={toggle}
      >
        <FaBars className="text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-40 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col items-center sm:items-start p-4 h-full pt-16">

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center w-full py-2 px-3 mb-4 rounded-lg hover:bg-blue-100 transition ${
                isActive ? 'bg-blue-200 font-bold' : ''
              }`
            }
          >
            <FaTachometerAlt className="text-xl" />
            {!isCollapsed && <span className="ml-3">Usuarios</span>}
          </NavLink>

          <NavLink
            to="/powerbi"
            className={({ isActive }) =>
              `flex items-center w-full py-2 px-3 mb-4 rounded-lg hover:bg-blue-100 transition ${
                isActive ? 'bg-blue-200 font-bold' : ''
              }`
            }
          >
            <FaChartBar className="text-xl" />
            {!isCollapsed && <span className="ml-3">Centrales</span>}
          </NavLink>

          <NavLink
            to="/inventory/products"
            className={({ isActive }) =>
              `flex items-center w-full py-2 px-3 mb-4 rounded-lg hover:bg-blue-100 transition ${
                isActive ? 'bg-blue-200 font-bold' : ''
              }`
            }
          >
            <FaChartBar className="text-xl" />
            {!isCollapsed && <span className="ml-3">Clientes</span>}
          </NavLink>
        </div>
      </div>
    </>
  )
}