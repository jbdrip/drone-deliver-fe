import { Outlet } from "react-router-dom"
import { useState } from 'react'
import Sidebar from './SideBar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar isCollapsed={isCollapsed} toggle={() => setIsCollapsed(!isCollapsed)} />
        
        {/* Main content with proper overflow handling */}
        <main className="flex-1 overflow-hidden bg-gray-100">
          <div className="h-full overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay for sidebar */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  )
}