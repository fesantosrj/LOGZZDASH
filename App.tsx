import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrdersView from './components/OrdersView';
import LogisticsView from './components/LogisticsView';
import MarketingView from './components/MarketingView';
import SettingsView from './components/SettingsView';
import { Order } from './types';
import { generateMockOrders } from './services/dataService';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch data
    const loadData = () => {
      setLoading(true);
      // Generating 100 mock orders to populate charts nicely
      const mockData = generateMockOrders(100); 
      setTimeout(() => {
        setOrders(mockData);
        setLoading(false);
      }, 800);
    };

    loadData();
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.date_order === updatedOrder.date_order ? updatedOrder : order
      )
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      case 'orders':
        return <OrdersView orders={orders} onAddOrder={handleAddOrder} onUpdateOrder={handleUpdateOrder} />;
      case 'logistics':
        return <LogisticsView orders={orders} />;
      case 'marketing':
        return <MarketingView orders={orders} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-slate-900 text-white z-20 p-4 flex items-center justify-between shadow-md">
         <span className="font-bold text-lg">Logzz Analytics</span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/95 md:hidden flex flex-col p-6">
           <div className="flex justify-end mb-4">
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">Fechar</button>
           </div>
           <nav className="space-y-2 text-white text-lg">
             {['dashboard', 'orders', 'logistics', 'marketing', 'settings'].map(view => (
                <button 
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`block w-full text-left py-3 px-4 border-b border-slate-800 capitalize ${currentView === view ? 'text-blue-400' : ''}`}
                >
                  {view === 'orders' ? 'Pedidos' : 
                   view === 'logistics' ? 'Logística' : 
                   view === 'settings' ? 'Configurações' : view}
                </button>
             ))}
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'overflow-hidden' : ''} md:ml-64 pt-16 md:pt-0`}>
        {loading ? (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default App;