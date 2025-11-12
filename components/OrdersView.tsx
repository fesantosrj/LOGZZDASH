import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Download, Plus, Pencil } from 'lucide-react';
import { Order } from '../types';
import ManualOrderModal from './ManualOrderModal';

interface OrdersViewProps {
  orders: Order[];
  onAddOrder?: (order: Order) => void;
  onUpdateOrder?: (order: Order) => void;
}

// Helper Component for Status Cell
const StatusCell: React.FC<{ order: Order; onUpdate: (o: Order) => void }> = ({ order, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus !== order.order_status) {
            onUpdate({ ...order, order_status: newStatus });
        }
        setIsEditing(false);
    };

    const getStatusColor = (status: string) => {
         if (status === 'Entregue') return 'bg-green-50 text-green-700 border-green-100';
         if (status === 'Cancelado') return 'bg-red-50 text-red-700 border-red-100';
         if (status === 'Enviado') return 'bg-blue-50 text-blue-700 border-blue-100';
         if (status === 'Falha na Entrega') return 'bg-red-50 text-red-700 border-red-100';
         return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    };

    if (isEditing) {
        return (
            <select 
                autoFocus 
                className="text-xs p-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={order.order_status} 
                onChange={handleChange}
                onBlur={() => setIsEditing(false)}
            >
                <option value="Agendado">Agendado</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Falha na Entrega">Falha na Entrega</option>
            </select>
        );
    }

    return (
        <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)} title="Clique para alterar status">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all group-hover:opacity-80 ${getStatusColor(order.order_status)}`}>
                {order.order_status}
            </span>
        </div>
    );
};

const OrdersView: React.FC<OrdersViewProps> = ({ orders, onAddOrder, onUpdateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.date_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client_email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const statuses = ['all', ...Array.from(new Set(orders.map(o => o.order_status)))];

  const handleOpenCreate = () => {
      setEditingOrder(null);
      setIsModalOpen(true);
  };

  const handleOpenEdit = (order: Order) => {
      setEditingOrder(order);
      setIsModalOpen(true);
  };

  const handleModalSubmit = (order: Order) => {
      if (editingOrder && onUpdateOrder) {
          onUpdateOrder(order);
      } else if (!editingOrder && onAddOrder) {
          onAddOrder(order);
      }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      <ManualOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        orderToEdit={editingOrder}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Pedidos</h2>
          <p className="text-gray-500 text-sm">Visualize e gerencie todos os seus pedidos</p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">
                <Plus size={18} />
                Novo Pedido
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                <Download size={18} />
                Exportar CSV
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por ID, nome ou email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter size={20} className="text-gray-400" />
          <select 
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'Todos os Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID do Pedido</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Produtos</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr key={idx} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.date_order}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.client_name}</span>
                        <span className="text-xs text-gray-400">{order.client_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.date_order_day.split(' ')[0]}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate" title={order.products.main.product_name}>
                        {order.products.main.product_name}
                        {order.products.main.variations.length > 0 && (
                           <span className="text-xs text-gray-400 ml-1">
                             (+{order.products.main.variations.length} var)
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {onUpdateOrder ? (
                            <StatusCell order={order} onUpdate={onUpdateOrder} />
                        ) : (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${order.order_status === 'Entregue' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                {order.order_status}
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      R$ {order.order_final_price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => handleOpenEdit(order)}
                            className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" 
                            title="Editar Pedido"
                        >
                            <Pencil size={18} />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="Ver Detalhes">
                            <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Nenhum pedido encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-500">Mostrando {filteredOrders.length} pedidos</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded bg-white text-xs text-gray-600 disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border border-gray-200 rounded bg-white text-xs text-gray-600">Próximo</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;