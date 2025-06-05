import { Package, MapPin, Clock, Truck, CreditCard } from 'lucide-react';

const OrderSummary = ({ orderData }) => (
  <div className="space-y-4">
    <div className="text-gray-600 text-sm">
      Revisa los detalles y si estás de acuerdo, pulsa en "Aceptar" para proceder con la compra y el envío.
    </div>
    
    {/* Información del Pedido */}
    <div className="bg-white border-2 border-blue-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Package className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Información del Pedido</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Número de pedido</span>
          <span className="font-medium text-gray-900">#{orderData.order.id}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Producto</span>
          <span className="font-medium text-gray-900">{orderData.order.product_name}</span>
        </div>
      </div>
    </div>

    {/* Información de Entrega */}
    <div className="bg-white border-2 border-orange-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Truck className="w-5 h-5 text-orange-600" />
        <h4 className="font-semibold text-gray-900">Información de Entrega</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-gray-500">Central de distribución asignada</span>
            <span className="font-medium text-gray-900">{orderData.order.assigned_distribution_center_name}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-gray-500">Distancia Total</span>
            <span className="font-medium text-gray-900">
              {orderData.order.total_distance ? orderData.order.total_distance.toLocaleString('es-ES') : '0'} km
            </span>
          </div>
          <div className="flex items-start space-x-1">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-gray-500">Tiempo Estimado</span>
              <span className="font-medium text-gray-900">
                {orderData.order.estimated_delivery_time ? orderData.order.estimated_delivery_time.toLocaleString('es-ES') : '0'} min
              </span>
            </div>
          </div>
        </div>

        {/* Ruta de Envío */}
        {orderData.route_info && (
          <div className="bg-gray-50 rounded-md p-3 border-l-4 border-orange-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-medium">Ruta de Envío</span>
                <span className="text-gray-700 text-sm">{orderData.route_info}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Información de Costos */}
    <div className="bg-white border-2 border-green-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <CreditCard className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-gray-900">Resumen de Costos</h4>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600">Costo Producto:</span>
          <span className="font-medium text-gray-900">
            Q {orderData.order.product_cost ? orderData.order.product_cost.toLocaleString('es-ES') : '0'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600">Costo Servicio:</span>
          <span className="font-medium text-gray-900">
            Q {orderData.order.service_cost ? orderData.order.service_cost.toLocaleString('es-ES') : '0'}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total a Pagar:</span>
            <span className="font-bold text-green-600 text-lg">
              Q {orderData.order.total_cost ? orderData.order.total_cost.toLocaleString('es-ES') : '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderSummary;