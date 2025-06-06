import { MapPin, Navigation, Target } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const RoutePreview = ({ orderData }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [map, setMap] = useState(null);
  const [L, setL] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  
  // Cargar Leaflet
  useEffect(() => {
    // Cargar CSS de Leaflet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Cargar JS de Leaflet
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setL(window.L);
    };
    document.body.appendChild(script);
    
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);
  
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
  
  // Inicializar mapa cuando Leaflet esté cargado
  useEffect(() => {
    if (!L || !mapRef.current || map) return;
    
    // Crear el mapa
    const newMap = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true
    });
    
    // Agregar capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);
    
    setMap(newMap);
    
    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, [L]);
  
  // Actualizar mapa cuando cambie la ruta
  useEffect(() => {
    if (!map || !L || !route.length) return;
    
    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    // Limpiar polyline anterior
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }
    
    // Crear coordenadas para Leaflet
    const coordinates = route.map(point => [point.latitude, point.longitude]);
    
    // Crear polyline
    polylineRef.current = L.polyline(coordinates, {
      color: '#8b5cf6',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(map);
    
    // Crear marcadores
    route.forEach((point, index) => {
      let iconHtml = '';
      let className = '';
      
      if (index === 0) {
        // Punto de origen
        iconHtml = `
          <div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `;
        className = 'origin-marker';
      } else if (index === route.length - 1) {
        // Punto de destino
        iconHtml = `
          <div class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        `;
        className = 'destination-marker';
      } else {
        // Puntos intermedios
        iconHtml = `
          <div class="flex items-center justify-center w-7 h-7 bg-indigo-500 rounded-full border-2 border-white shadow-lg">
            <span class="text-white text-xs font-bold">${index + 1}</span>
          </div>
        `;
        className = 'intermediate-marker';
      }
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: `custom-marker ${className}`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
      
      const marker = L.marker([point.latitude, point.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <div class="font-semibold text-gray-900">${point.center_name}</div>
            <div class="text-sm text-gray-600">
              Lat: ${point.latitude.toFixed(6)}<br>
              Lng: ${point.longitude.toFixed(6)}
            </div>
            <div class="text-xs mt-1 px-2 py-1 rounded ${
              index === 0 ? 'bg-green-100 text-green-700' :
              index === route.length - 1 ? 'bg-red-100 text-red-700' :
              'bg-indigo-100 text-indigo-700'
            }">
              ${index === 0 ? 'Origen' : index === route.length - 1 ? 'Destino' : `Parada ${index + 1}`}
            </div>
          </div>
        `);
      
      marker.on('click', () => {
        setSelectedPoint(selectedPoint === index ? null : index);
      });
      
      markersRef.current.push(marker);
    });
    
    // Ajustar vista para mostrar toda la ruta
    map.fitBounds(coordinates, { padding: [20, 20] });
    
  }, [map, L, route, selectedPoint]);
  
  // Resaltar punto seleccionado
  useEffect(() => {
    if (!map || !L || selectedPoint === null) return;
    
    // Abrir popup del marcador seleccionado
    if (markersRef.current[selectedPoint]) {
      markersRef.current[selectedPoint].openPopup();
    }
  }, [selectedPoint, map, L]);

  return (
    <div className="bg-white border-purple-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Navigation className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900">Vista previa de la ruta</h4>
      </div>
      
      {/* Contenedor principal con layout en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mapa Leaflet */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4">
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-200 shadow-inner"
              style={{ minHeight: '400px' }}
            />
            {!L && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Cargando mapa...</p>
                </div>
              </div>
            )}
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
                  key={`${point.center_id}-${index}`}
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
      
      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default RoutePreview;