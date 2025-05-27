// src/components/Layout.jsx
import { Outlet } from "react-router-dom"

import { useState } from 'react'
import Sidebar from './SideBar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarWidth = isCollapsed ? 64 : 256 // Tailwind: w-16 (64px) o w-64 (256px)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggle={() => setIsCollapsed(!isCollapsed)} />

      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar />
        <main className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}