import { useState, useEffect } from 'react'

export default function DataTable({
  columns,
  data,
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = "Buscar...",
  isLoading = false
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch])

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, currentPage + 2)
      
      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Search Bar - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {totalItems > 0 && `${totalItems} registro${totalItems !== 1 ? 's' : ''} encontrado${totalItems !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* Table Container - Flexible */}
      <div className="flex-1 min-h-0 overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block h-full">
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 ${
                        column.width || 'min-w-0'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500 text-sm">Cargando datos...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">No se encontraron resultados</p>
                          {searchTerm && (
                            <p className="text-gray-400 text-xs mt-1">
                              Intenta ajustar tu búsqueda o filtros
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {columns.map((column, colIndex) => (
                        <td 
                          key={colIndex} 
                          className={`px-4 py-4 text-sm text-gray-900 ${column.width || 'min-w-0'}`}
                        >
                          <div className={column.key === 'actions' ? '' : 'truncate'}>
                            {column.render ? column.render(row, rowIndex) : row[column.key] || '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden h-full overflow-auto">
          <div className="p-4 space-y-4 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-500 text-sm">Cargando datos...</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">No se encontraron resultados</p>
                  {searchTerm && (
                    <p className="text-gray-400 text-xs mt-1">
                      Intenta ajustar tu búsqueda
                    </p>
                  )}
                </div>
              </div>
            ) : (
              data.map((row, rowIndex) => (
                <div key={rowIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 space-y-2">
                    {columns.map((column, colIndex) => {
                      if (column.key === 'actions') return null
                      
                      const value = column.render ? column.render(row, rowIndex) : row[column.key]
                      
                      return (
                        <div key={colIndex} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600 flex-shrink-0 mr-3">
                            {column.header}:
                          </span>
                          <span className="text-sm text-gray-900 text-right flex-1 min-w-0">
                            {value || '-'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Mobile Actions */}
                  {columns.find(col => col.key === 'actions') && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-end space-x-2">
                        {columns.find(col => col.key === 'actions').render(row, rowIndex)}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination - Fixed */}
      {totalItems > 0 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Mostrando <span className="font-medium">{startItem}</span> a{' '}
              <span className="font-medium">{endItem}</span> de{' '}
              <span className="font-medium">{totalItems}</span> resultados
            </div>
            
            <div className="flex items-center justify-center space-x-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <div className="hidden sm:flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...' || isLoading}
                    className={`px-3 py-2 text-sm font-medium border transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                        : page === '...'
                        ? 'bg-white text-gray-400 border-gray-300 cursor-default'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
                {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}