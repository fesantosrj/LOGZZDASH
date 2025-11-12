export interface ProductVariation {
  product_name: string;
  variation_names: string;
  product_code: string;
  quantity: number;
}

export interface MainProduct {
  product_name: string;
  product_code: string;
  quantity: number;
  variations: ProductVariation[];
}

export interface Products {
  main: MainProduct;
}

export interface UTM {
  utm_source: string;
  utm_content: string;
  utm_term: string;
  utm_medium: string;
  utm_id: string;
  utm_campaign: string;
}

export interface Order {
  client_name: string;
  client_email: string;
  client_document: string;
  client_phone: string;
  client_zip_code: string;
  client_address: string;
  client_address_number: string;
  client_address_district: string;
  client_address_city: string;
  client_address_state: string;
  client_address_country: string;
  date_order: string; // internal ID-like string
  date_order_day: string; // "YYYY-MM-DD HH:mm:ss"
  date_delivery: string;
  date_delivery_day: string;
  delivery_estimate: string;
  order_number: string | null;
  order_status: string; // "Agendado", "Enviado", "Entregue", "Cancelado"
  order_status_description: string;
  order_quantity: number;
  order_final_price: string; // "50.00"
  second_order: boolean;
  first_order: boolean;
  products: Products;
  logistic_operator: string;
  delivery_man: string;
  delivery_man_phone: string;
  producer_name: string;
  affiliate_name: string | null;
  commission: number;
  utm: UTM;
}