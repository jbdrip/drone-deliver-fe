import { NavLink } from 'react-router-dom'
import { FaBars, FaTachometerAlt, FaChartBar, FaUsers, FaBuilding } from 'react-icons/fa'

export default function Sidebar({ isCollapsed, toggle }) {
  return (
    <div className={`flex flex-col bg-white shadow-lg transition-all duration-300 relative ${
      isCollapsed ? 'w-20' : 'w-64'
    } lg:${isCollapsed ? 'w-20' : 'w-64'} lg:relative fixed lg:static inset-y-0 left-0 z-50 translate-x-0`}>
      
      {/* Toggle Button */}
      <div className={`flex items-center justify-${isCollapsed ? 'center' : 'between'} p-4 border-b border-gray-200`}>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggle}
        >
          <FaBars className="text-gray-700 text-lg" />
        </button>
        
        {/* Logo/Brand */}
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D2</span>
            </div>
            <span className="font-semibold text-gray-800">Drone Deliver</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center py-3 px-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FaUsers className={`text-xl flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && (
            <span className="ml-3 font-medium transition-all duration-200">
              Usuarios
            </span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Usuarios
            </div>
          )}
        </NavLink>

        {/*<NavLink
          to="/powerbi"
          className={({ isActive }) =>
            `flex items-center py-3 px-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FaChartBar className={`text-xl flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && (
            <span className="ml-3 font-medium transition-all duration-200">
              Centrales
            </span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Centrales
            </div>
          )}
        </NavLink>*/}

        <NavLink
          to="customers"
          className={({ isActive }) =>
            `flex items-center py-3 px-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FaBuilding className={`text-xl flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && (
            <span className="ml-3 font-medium transition-all duration-200">
              Clientes
            </span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Clientes
            </div>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            <p>© 2025 Drone Deliver</p>
            <p>Versión 1.0.0</p>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <span className="text-xs text-gray-500">v1</span>
          </div>
        )}
      </div>
    </div>
  )
}