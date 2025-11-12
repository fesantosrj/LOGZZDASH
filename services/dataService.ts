import { Order } from '../types';

const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];
const STATES = ['SP', 'RJ', 'MG', 'PR', 'RS'];
const STATUSES = ['Agendado', 'Enviado', 'Entregue', 'Cancelado', 'Falha na Entrega'];
const SOURCES = ['google', 'facebook', 'instagram', 'tiktok', 'email'];
const CAMPAIGNS = ['black_friday', 'summer_sale', 'welcome_promo', 'retargeting_v1'];
const PRODUCTS = ['Pote Genérico', 'Kit Premium', 'Suplemento X', 'Creme Hidratante'];

// Helper to get random item from array
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random date within last 30 days
const getRandomDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().replace('T', ' ').split('.')[0];
};

export const generateMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }).map((_, index) => {
    const cityIndex = Math.floor(Math.random() * CITIES.length);
    const price = (Math.random() * 150 + 20).toFixed(2);
    const quantity = Math.floor(Math.random() * 3) + 1;

    return {
      client_name: `Cliente ${index + 1}`,
      client_email: `cliente${index + 1}@example.com`,
      client_document: `000.000.000-${index}`,
      client_phone: "+551199999999",
      client_zip_code: "00000-000",
      client_address: "Rua Exemplo",
      client_address_number: "123",
      client_address_district: "Centro",
      client_address_city: CITIES[cityIndex],
      client_address_state: STATES[cityIndex],
      client_address_country: "Brasil",
      date_order: `ORD-${1000 + index}`,
      date_order_day: getRandomDate(),
      date_delivery: "terça-feira",
      date_delivery_day: "2023-11-22 00:00:00",
      delivery_estimate: "quarta-feira",
      order_number: null,
      order_status: getRandom(STATUSES),
      order_status_description: "",
      order_quantity: quantity,
      order_final_price: price,
      second_order: Math.random() > 0.7,
      first_order: Math.random() <= 0.7,
      products: {
        main: {
          product_name: getRandom(PRODUCTS),
          product_code: `PROD-${index}`,
          quantity: quantity,
          variations: [
            {
              product_name: "Variação Padrão",
              variation_names: "Cor: Padrão",
              product_code: `VAR-${index}`,
              quantity: quantity
            }
          ]
        }
      },
      logistic_operator: getRandom(['Loggi', 'Correios', 'Jadlog']),
      delivery_man: "Entregador Padrão",
      delivery_man_phone: "+551100000000",
      producer_name: "Minha Loja",
      affiliate_name: null,
      commission: parseFloat(price) * 0.1,
      utm: {
        utm_source: getRandom(SOURCES),
        utm_content: "content",
        utm_term: "term",
        utm_medium: "cpc",
        utm_id: "id",
        utm_campaign: getRandom(CAMPAIGNS)
      }
    };
  });
};