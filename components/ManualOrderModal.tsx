import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Edit, Loader2 } from 'lucide-react';
import { Order } from '../types';

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order) => void;
  orderToEdit?: Order | null;
}

// Hardcoded states to avoid unnecessary API call for static data
const BRAZIL_STATES = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

const ManualOrderModal: React.FC<ManualOrderModalProps> = ({ isOpen, onClose, onSubmit, orderToEdit }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_document: '',
    client_zip_code: '',
    client_address: '',
    client_address_number: '',
    client_address_district: '',
    client_address_city: '',
    client_address_state: '',
    product_name: '',
    product_price: '',
    quantity: 1,
    status: 'Agendado'
  });

  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch cities from IBGE API when state changes
  useEffect(() => {
    if (formData.client_address_state) {
      setLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.client_address_state}/municipios`)
        .then(response => response.json())
        .then(data => {
          const cityNames = data.map((city: any) => city.nome).sort();
          setCities(cityNames);
          setLoadingCities(false);
        })
        .catch(err => {
          console.error('Failed to fetch cities', err);
          setLoadingCities(false);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  }, [formData.client_address_state]);

  // Reset or Populate form when modal opens/closes or orderToEdit changes
  useEffect(() => {
    if (isOpen && orderToEdit) {
      setFormData({
        client_name: orderToEdit.client_name,
        client_email: orderToEdit.client_email,
        client_phone: orderToEdit.client_phone,
        client_document: orderToEdit.client_document,
        client_zip_code: orderToEdit.client_zip_code,
        client_address: orderToEdit.client_address,
        client_address_number: orderToEdit.client_address_number,
        client_address_district: orderToEdit.client_address_district,
        client_address_city: orderToEdit.client_address_city,
        client_address_state: orderToEdit.client_address_state,
        product_name: orderToEdit.products.main.product_name,
        product_price: orderToEdit.order_final_price,
        quantity: orderToEdit.order_quantity,
        status: orderToEdit.order_status
      });
    } else if (isOpen && !orderToEdit) {
       setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_document: '',
        client_zip_code: '',
        client_address: '',
        client_address_number: '',
        client_address_district: '',
        client_address_city: '',
        client_address_state: '', // Start empty to force selection
        product_name: '',
        product_price: '',
        quantity: 1,
        status: 'Agendado'
      });
    }
  }, [isOpen, orderToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderToEdit) {
      // EDIT MODE
      const updatedOrder: Order = {
        ...orderToEdit,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_document: formData.client_document,
        client_phone: formData.client_phone,
        client_zip_code: formData.client_zip_code,
        client_address: formData.client_address,
        client_address_number: formData.client_address_number,
        client_address_district: formData.client_address_district,
        client_address_city: formData.client_address_city,
        client_address_state: formData.client_address_state,
        order_status: formData.status,
        order_quantity: Number(formData.quantity),
        order_final_price: parseFloat(formData.product_price).toFixed(2),
        products: {
            ...orderToEdit.products,
            main: {
                ...orderToEdit.products.main,
                product_name: formData.product_name,
                quantity: Number(formData.quantity)
            }
        }
      };
      onSubmit(updatedOrder);

    } else {
      // CREATE MODE
      const newOrder: Order = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_document: formData.client_document,
        client_phone: formData.client_phone,
        client_zip_code: formData.client_zip_code,
        client_address: formData.client_address,
        client_address_number: formData.client_address_number,
        client_address_district: formData.client_address_district,
        client_address_city: formData.client_address_city,
        client_address_state: formData.client_address_state,
        client_address_country: 'Brasil',
        date_order: `MAN-${Math.floor(Math.random() * 10000)}`,
        date_order_day: new Date().toISOString().replace('T', ' ').split('.')[0],
        date_delivery: 'N/A',
        date_delivery_day: 'N/A',
        delivery_estimate: '5 dias úteis',
        order_number: null,
        order_status: formData.status,
        order_status_description: 'Manual Entry',
        order_quantity: Number(formData.quantity),
        order_final_price: parseFloat(formData.product_price).toFixed(2),
        second_order: false,
        first_order: true,
        products: {
          main: {
            product_name: formData.product_name,
            product_code: `MAN-${Math.floor(Math.random() * 1000)}`,
            quantity: Number(formData.quantity),
            variations: []
          }
        },
        logistic_operator: 'Manual',
        delivery_man: 'N/A',
        delivery_man_phone: '',
        producer_name: 'Admin',
        affiliate_name: null,
        commission: 0,
        utm: {
          utm_source: 'manual_entry',
          utm_content: '',
          utm_term: '',
          utm_medium: '',
          utm_id: '',
          utm_campaign: 'manual'
        }
      };
      onSubmit(newOrder);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If state changes, clear the city unless we are just initializing
    if (name === 'client_address_state' && value !== formData.client_address_state) {
        setFormData(prev => ({ ...prev, [name]: value, client_address_city: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {orderToEdit ? <Edit className="text-blue-600" size={24} /> : <Plus className="text-blue-600" size={24} />}
            {orderToEdit ? 'Editar Pedido' : 'Novo Pedido Manual'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dados do Cliente</h3>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input required name="client_name" value={formData.client_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Ex: João Silva" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CPF/CNPJ</label>
              <input required name="client_document" value={formData.client_document} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" required name="client_email" value={formData.client_email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="joao@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input required name="client_phone" value={formData.client_phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="(11) 99999-9999" />
            </div>

            <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Endereço de Entrega</h3>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CEP</label>
              <input required name="client_zip_code" value={formData.client_zip_code} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="00000-000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Endereço</label>
              <input required name="client_address" value={formData.client_address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Rua, Av..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Número</label>
                    <input required name="client_address_number" value={formData.client_address_number} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Bairro</label>
                    <input required name="client_address_district" value={formData.client_address_district} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                     <select 
                        required
                        name="client_address_state" 
                        value={formData.client_address_state} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                    >
                        <option value="" disabled>Selecione...</option>
                        {BRAZIL_STATES.map(state => (
                            <option key={state.sigla} value={state.sigla}>{state.nome}</option>
                        ))}
                    </select>
                </div>
                 <div className="space-y-1 relative">
                    <label className="text-sm font-medium text-gray-700">Cidade</label>
                    {loadingCities ? (
                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
                            <Loader2 className="animate-spin" size={16} />
                            <span className="text-sm">Carregando...</span>
                        </div>
                    ) : (
                        <select 
                            required
                            name="client_address_city" 
                            value={formData.client_address_city} 
                            onChange={handleChange} 
                            disabled={!formData.client_address_state}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="" disabled>Selecione a cidade...</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Detalhes do Pedido</h3>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Produto</label>
              <input required name="product_name" value={formData.product_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Nome do produto" />
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Preço (R$)</label>
                    <input type="number" step="0.01" required name="product_price" value={formData.product_price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Qtd.</label>
                    <input type="number" min="1" required name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                     <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                        <option value="Agendado">Agendado</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Falha na Entrega">Falha na Entrega</option>
                    </select>
                </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20">
                <Save size={18} />
                {orderToEdit ? 'Atualizar Pedido' : 'Salvar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOrderModal;