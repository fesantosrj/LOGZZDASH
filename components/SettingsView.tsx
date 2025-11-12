import React from 'react';
import { Save, User, Bell, Globe, Key } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
        <p className="text-gray-500 text-sm">Gerencie suas preferências e integrações</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Globe size={20} className="text-blue-600"/>
                Integração Webhook
            </h3>
            <p className="text-sm text-gray-500 mt-1">Configure o endpoint para receber dados da Logzz</p>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Webhook (n8n)</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        readOnly
                        value="https://n8n.seu-dominio.com/webhook/logzz-analytics-v1" 
                        className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-mono"
                    />
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        Copiar
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Cole esta URL no painel da Logzz para começar a receber eventos.</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} className="text-blue-600"/>
                Perfil da Loja
            </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                <input type="text" defaultValue="Minha Loja Oficial" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Suporte</label>
                <input type="email" defaultValue="contato@minhaloja.com" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bell size={20} className="text-blue-600"/>
                Notificações
            </h3>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Alerta de Vendas</p>
                    <p className="text-sm text-gray-500">Receba um som a cada nova venda</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Resumo Diário</p>
                    <p className="text-sm text-gray-500">Receba um email com o resumo das vendas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
      </div>

      <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/30">
              <Save size={18} />
              Salvar Alterações
          </button>
      </div>

    </div>
  );
};

export default SettingsView;