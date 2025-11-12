import React, { useMemo } from 'react';
import { Truck, MapPin, CheckCircle, XCircle, Clock, Map as MapIcon } from 'lucide-react';
import { Order } from '../types';
import KPICard from './KPICard';
import DeliveryMap from './DeliveryMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LogisticsViewProps {
  orders: Order[];
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ orders }) => {
  
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(o => o.order_status === 'Entregue').length;
    const inTransit = orders.filter(o => o.order_status === 'Enviado').length;
    const failed = orders.filter(o => o.order_status === 'Falha na Entrega' || o.order_status === 'Cancelado').length;
    
    const successRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '0';

    // Deliveries by State
    const stateMap = orders.reduce((acc, curr) => {
        acc[curr.client_address_state] = (acc[curr.client_address_state] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const stateData = Object.entries(stateMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Carrier Performance
    const carrierMap = orders.reduce((acc, curr) => {
        if (!acc[curr.logistic_operator]) {
            acc[curr.logistic_operator] = { total: 0, delivered: 0 };
        }
        acc[curr.logistic_operator].total += 1;
        if (curr.order_status === 'Entregue') {
            acc[curr.logistic_operator].delivered += 1;
        }
        return acc;
    }, {} as Record<string, { total: number; delivered: number }>);

    const carrierData = Object.entries(carrierMap).map(([name, data]) => ({
        name,
        total: data.total,
        rate: data.total > 0 ? (data.delivered / data.total) * 100 : 0
    })).sort((a, b) => b.total - a.total);

    return { delivered, inTransit, failed, successRate, stateData, carrierData };
  }, [orders]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Operação Logística</h2>
        <p className="text-gray-500 text-sm">Monitore o desempenho das suas entregas em tempo real</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Entregues" 
          value={stats.delivered} 
          icon={CheckCircle} 
          color="bg-green-500"
        />
        <KPICard 
          title="Em Trânsito" 
          value={stats.inTransit} 
          icon={Truck} 
          color="bg-blue-500"
        />
        <KPICard 
          title="Taxa de Sucesso" 
          value={`${stats.successRate}%`} 
          icon={MapPin} 
          color="bg-purple-500"
        />
        <KPICard 
          title="Falhas / Cancelados" 
          value={stats.failed} 
          icon={XCircle} 
          color="bg-red-500"
        />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <MapIcon size={18} className="text-blue-600"/>
                    Mapa de Calor de Entregas
                </h3>
                <p className="text-sm text-gray-500">Distribuição geográfica dos pedidos por cidade</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Volume de Pedidos
                </span>
            </div>
          </div>
          <div className="h-[500px] w-full bg-gray-50">
              <DeliveryMap orders={orders} />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600"/>
                Entregas por Estado
            </h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.stateData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Carrier Performance Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Truck size={18} className="text-orange-600"/>
                Performance por Transportadora
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Transportadora</th>
                            <th className="px-4 py-3 text-center">Volume</th>
                            <th className="px-4 py-3 text-right">Taxa de Entrega</th>
                            <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.carrierData.map((carrier, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{carrier.name}</td>
                                <td className="px-4 py-3 text-center">{carrier.total}</td>
                                <td className="px-4 py-3 text-right font-medium">
                                    {carrier.rate.toFixed(1)}%
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        carrier.rate > 80 ? 'bg-green-100 text-green-800' : 
                                        carrier.rate > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {carrier.rate > 80 ? 'Ótimo' : carrier.rate > 50 ? 'Regular' : 'Crítico'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Recent Logistics Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Clock size={18} className="text-gray-600"/>
             Rastreamento Recente
          </h3>
          <div className="space-y-3">
              {orders.slice(0, 5).map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                              order.order_status === 'Entregue' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                              <Truck size={16} />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-900">Pedido #{order.date_order}</p>
                              <p className="text-xs text-gray-500">
                                  {order.logistic_operator} • {order.client_address_city} - {order.client_address_state}
                              </p>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              order.order_status === 'Entregue' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                              {order.order_status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">Previsão: {order.delivery_estimate}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};

export default LogisticsView;