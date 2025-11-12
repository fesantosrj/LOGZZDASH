import React, { useMemo } from 'react';
import { BarChart3, MousePointer, Target, Share2, TrendingUp } from 'lucide-react';
import { Order } from '../types';
import KPICard from './KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface MarketingViewProps {
  orders: Order[];
}

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

const MarketingView: React.FC<MarketingViewProps> = ({ orders }) => {
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.order_final_price), 0);
        
        // UTM Source Analysis
        const sourceMap = orders.reduce((acc, curr) => {
            const source = curr.utm.utm_source || 'Direto/Orgânico';
            if (!acc[source]) acc[source] = { count: 0, revenue: 0 };
            acc[source].count += 1;
            acc[source].revenue += parseFloat(curr.order_final_price);
            return acc;
        }, {} as Record<string, { count: number; revenue: number }>);

        const sourceData = Object.entries(sourceMap)
            .map(([name, data]) => ({ 
                name, 
                value: data.count, 
                revenue: data.revenue 
            }))
            .sort((a, b) => b.revenue - a.revenue);

        // Campaign Analysis
        const campaignMap = orders.reduce((acc, curr) => {
            const camp = curr.utm.utm_campaign || '(not set)';
            if (!acc[camp]) acc[camp] = { count: 0, revenue: 0, source: curr.utm.utm_source || '-' };
            acc[camp].count += 1;
            acc[camp].revenue += parseFloat(curr.order_final_price);
            return acc;
        }, {} as Record<string, { count: number; revenue: number; source: string }>);

        const campaignData = Object.entries(campaignMap)
            .map(([name, data]) => ({
                name,
                ...data
            }))
            .sort((a, b) => b.revenue - a.revenue);

        return { totalRevenue, sourceData, campaignData };
    }, [orders]);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Analytics de Marketing</h2>
                <p className="text-gray-500 text-sm">Entenda a origem das suas vendas (UTMs)</p>
            </div>

             {/* Top Level Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard 
                    title="Receita Atribuída" 
                    value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                    icon={Target} 
                    color="bg-pink-500"
                />
                <KPICard 
                    title="Melhor Canal" 
                    value={stats.sourceData[0]?.name || '-'} 
                    icon={Share2} 
                    color="bg-purple-500"
                    trend={`${stats.sourceData[0]?.value || 0} pedidos`}
                />
                 <KPICard 
                    title="Melhor Campanha" 
                    value={stats.campaignData[0]?.name || '-'} 
                    icon={TrendingUp} 
                    color="bg-orange-500"
                    trend={`R$ ${stats.campaignData[0]?.revenue.toFixed(2) || 0}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Receita por Canal (UTM Source)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.sourceData} layout="vertical" margin={{left: 40}}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" tickFormatter={(val) => `R$${val/1000}k`} />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                <Tooltip formatter={(val) => `R$ ${Number(val).toFixed(2)}`} cursor={{fill: '#F3F4F6'}} />
                                <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Distribution Pie */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Share de Vendas (Quantidade)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {stats.sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Detalhes das Campanhas</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Campanha (utm_campaign)</th>
                                <th className="px-6 py-3">Canal (utm_source)</th>
                                <th className="px-6 py-3 text-center">Pedidos</th>
                                <th className="px-6 py-3 text-right">Receita Total</th>
                                <th className="px-6 py-3 text-right">Ticket Médio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.campaignData.map((camp, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{camp.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                            {camp.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">{camp.count}</td>
                                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                        R$ {camp.revenue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        R$ {(camp.revenue / camp.count).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketingView;