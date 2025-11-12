import React from 'react';
import { LayoutDashboard, Package, Truck, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: Package },
    { id: 'logistics', label: 'Logística', icon: Truck },
    { id: 'marketing', label: 'Marketing', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-slate-300 hidden md:flex z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
        <h1 className="text-xl font-bold text-white tracking-tight">Logzz Analytics</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-800 rounded-lg text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;