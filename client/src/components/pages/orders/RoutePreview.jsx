import { MapPin, Navigation, Target } from 'lucide-react';
import { useState } from 'react';

const RoutePreview = ({ orderData }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  // Verificar que existe la ruta de entrega
  if (!orderData.delivery_route || orderData.delivery_route.length === 0) {
    return (
      <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Navigation className="w-5 h-5 text-gray-400" />
          <h4 className="font-semibold text-gray-900">Vista Previa de la Ruta</h4>
        </div>
        <p className="text-gray-500 text-sm">No hay información de la ruta disponible</p>
      </div>
    );
  }

  const route = orderData.delivery_route;
  
  // Calcular el centro del mapa basado en las coordenadas
  const centerLat = route.reduce((sum, point) => sum + point.latitude, 0) / route.length;
  const centerLng = route.reduce((sum, point) => sum + point.longitude, 0) / route.length;
  
  // Calcular los límites para el zoom
  const latitudes = route.map(point => point.latitude);
  const longitudes = route.map(point => point.longitude);
  const latRange = Math.max(...latitudes) - Math.min(...latitudes);
  const lngRange = Math.max(...longitudes) - Math.min(...longitudes);
  const maxRange = Math.max(latRange, lngRange);
  
  // Escala para convertir coordenadas a píxeles (aumentando el zoom significativamente)
  const scale = maxRange > 0 ? 400 / maxRange : 2000; // Aumentado de 200 a 400 (zoom 2x)
  
  // Función para convertir coordenadas geográficas a píxeles del SVG
  const coordToPixel = (lat, lng) => ({
    x: 300 + (lng - centerLng) * scale, // Ajustado para el nuevo tamaño
    y: 250 - (lat - centerLat) * scale  // Ajustado para el nuevo tamaño
  });

  // Generar puntos SVG para la ruta
  const svgPoints = route.map(point => ({
    ...point,
    ...coordToPixel(point.latitude, point.longitude)
  }));

  // Crear el path SVG para la línea de ruta
  const pathData = svgPoints.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '');

  return (
    <div className="bg-white border-purple-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Navigation className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900">Vista previa de la ruta</h4>
      </div>
      
      {/* Contenedor principal con layout en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mapa SVG - ocupará 2 columnas en pantallas grandes */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4">
            <svg 
              width="100%" 
              height="400" 
              viewBox="0 0 600 500" 
              className="border border-gray-200 rounded-lg bg-white shadow-inner"
            >
              {/* Grid de fondo */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Línea de ruta */}
              <path
                d={pathData}
                stroke="#8b5cf6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              
              {/* Puntos de la ruta */}
              {svgPoints.map((point, index) => (
                <g key={point.center_id}>
                  {/* Círculo del punto */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={index === 0 ? "10" : index === svgPoints.length - 1 ? "10" : "8"}
                    fill={index === 0 ? "#10b981" : index === svgPoints.length - 1 ? "#ef4444" : "#6366f1"}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:r-12 transition-all"
                    onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
                  />
                  
                  {/* Icono para el primer punto (origen) */}
                  {index === 0 && (
                    <MapPin 
                      x={point.x - 8} 
                      y={point.y - 8} 
                      width="16" 
                      height="16" 
                      className="pointer-events-none text-white"
                    />
                  )}
                  
                  {/* Icono para el último punto (destino) */}
                  {index === svgPoints.length - 1 && (
                    <Target 
                      x={point.x - 8} 
                      y={point.y - 8} 
                      width="16" 
                      height="16" 
                      className="pointer-events-none text-white"
                    />
                  )}
                  
                  {/* Número del punto */}
                  <text
                    x={point.x}
                    y={point.y + 25}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-600"
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
              
              {/* Información del punto seleccionado */}
              {selectedPoint !== null && (
                <g>
                  <rect
                    x={svgPoints[selectedPoint].x - 80}
                    y={svgPoints[selectedPoint].y - 60}
                    width="160"
                    height="45"
                    fill="white"
                    stroke="#6366f1"
                    strokeWidth="2"
                    rx="8"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={svgPoints[selectedPoint].x}
                    y={svgPoints[selectedPoint].y - 40}
                    textAnchor="middle"
                    className="text-sm font-semibold fill-gray-800"
                  >
                    {route[selectedPoint].center_name}
                  </text>
                  <text
                    x={svgPoints[selectedPoint].x}
                    y={svgPoints[selectedPoint].y - 25}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {route[selectedPoint].latitude.toFixed(4)}, {route[selectedPoint].longitude.toFixed(4)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
        
        {/* Lista de puntos de ruta - panel lateral derecho */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 h-full">
            <h5 className="font-medium text-gray-900 text-sm mb-3 flex items-center justify-between">
              <span>Puntos de Ruta</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {route.length} paradas
              </span>
            </h5>
            <div className="space-y-2 max-h-90 overflow-y-auto">
              {route.map((point, index) => (
                <div
                  key={point.center_id}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-sm cursor-pointer transition-all ${
                    selectedPoint === index 
                      ? 'bg-purple-100 border-2 border-purple-300 shadow-sm' 
                      : 'bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
                >
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm ${
                    index === 0 
                      ? 'bg-green-500' 
                      : index === route.length - 1 
                        ? 'bg-red-500' 
                        : 'bg-indigo-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate text-xs">
                      {index + 1}. {point.center_name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Origen
                    </span>
                  )}
                  {index === route.length - 1 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      Destino
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Información adicional en el panel lateral */}
            <div className="mt-4 pt-3 border-t border-gray-300">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Punto de origen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-600">Centros intermedios</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Destino final</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePreview;