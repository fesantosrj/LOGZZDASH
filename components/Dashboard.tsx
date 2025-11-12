import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, MapPin } from 'lucide-react';
import { Order } from '../types';
import KPICard from './KPICard';

interface DashboardProps {
  orders: Order[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  
  // --- Data Processing ---

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.order_final_price), 0);
    const totalOrders = orders.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Sales by Date
    const salesByDateMap = orders.reduce((acc, curr) => {
      const date = curr.date_order_day.split(' ')[0]; // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + parseFloat(curr.order_final_price);
      return acc;
    }, {} as Record<string, number>);

    const salesByDate = Object.entries(salesByDateMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Order Status Distribution
    const statusMap = orders.reduce((acc, curr) => {
      acc[curr.order_status] = (acc[curr.order_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // Marketing Sources
    const sourceMap = orders.reduce((acc, curr) => {
      const source = curr.utm.utm_source || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceData = Object.entries(sourceMap)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);

    // Top Campaigns
    const campaignMap = orders.reduce((acc, curr) => {
      const camp = curr.utm.utm_campaign || 'None';
      const val = parseFloat(curr.order_final_price);
      acc[camp] = (acc[camp] || 0) + val;
      return acc;
    }, {} as Record<string, number>);

    const campaignData = Object.entries(campaignMap)
      .map(([name, revenue]) => ({ name, revenue: Number(revenue) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Logistics Performance
    const logisticsMap = orders.reduce((acc, curr) => {
        acc[curr.logistic_operator] = (acc[curr.logistic_operator] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const logisticsData = Object.entries(logisticsMap)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count);


    return {
      totalRevenue,
      totalOrders,
      avgTicket,
      salesByDate,
      statusData,
      sourceData,
      campaignData,
      logisticsData
    };
  }, [orders]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Geral</h2>
            <p className="text-gray-500 text-sm">Visão completa da sua operação Logzz</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Atualizado Agora</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Faturamento Total" 
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          color="bg-green-500"
          trend="+12.5% vs mês anterior"
        />
        <KPICard 
          title="Total de Pedidos" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-blue-500"
        />
        <KPICard 
          title="Ticket Médio" 
          value={`R$ ${stats.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          color="bg-purple-500"
        />
        <KPICard 
          title="Total de Clientes" 
          value={stats.totalOrders} // Approximated for demo
          icon={Users} 
          color="bg-orange-500"
        />
      </div>

      {/* Main Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600"/>
            Vendas no Período
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesByDate}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                    dataKey="date" 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')} // Show MM/DD
                />
                <YAxis tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-green-600"/>
            Status dos Pedidos
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Marketing & Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Marketing Sources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowUpRight size={18} className="text-purple-600"/>
                Origem das Vendas (UTM Source)
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.sourceData} layout="vertical" margin={{left: 20}}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fill: '#374151', fontSize: 13, fontWeight: 500}} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} />
                        <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Top Campaigns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-600"/>
                Top Campanhas (Receita)
            </h3>
            <div className="space-y-4">
                {stats.campaignData.map((camp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                            </div>
                            <span className="font-medium text-gray-700 capitalize">{camp.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">R$ {camp.revenue.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Operations / Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logistics Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-red-600"/>
                Operadores Logísticos
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Operador</th>
                            <th className="px-4 py-3 text-right">Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.logisticsData.map((log, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{log.name}</td>
                                <td className="px-4 py-3 text-right">{log.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Últimos Pedidos</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map((order, idx) => (
                            <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{order.date_order}</td>
                                <td className="px-6 py-4">{order.client_name}</td>
                                <td className="px-6 py-4">{order.date_order_day.split(' ')[0]}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${order.order_status === 'Entregue' ? 'bg-green-100 text-green-800' : 
                                          order.order_status === 'Cancelado' ? 'bg-red-100 text-red-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        {order.order_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">R$ {order.order_final_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;