import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Order } from '../types';

interface DeliveryMapProps {
  orders: Order[];
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Belo Horizonte': [-19.9167, -43.9345],
  'Curitiba': [-25.4284, -49.2733],
  'Porto Alegre': [-30.0346, -51.2177],
  'Brasília': [-15.7975, -47.8919],
  'Salvador': [-12.9777, -38.5016],
  'Fortaleza': [-3.7172, -38.5434],
  'Recife': [-8.0476, -34.8770],
  'Manaus': [-3.1190, -60.0217],
  'Belém': [-1.4558, -48.4902],
  'Goiânia': [-16.6869, -49.2648],
  'Campinas': [-22.9099, -47.0626],
  'São Luís': [-2.5391, -44.2829],
  'Maceió': [-9.6662, -35.7351],
};

const DeliveryMap: React.FC<DeliveryMapProps> = ({ orders }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([-14.2350, -51.9253], 4); // Center of Brazil

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Aggregate data by city
    const cityData = orders.reduce((acc, order) => {
      const city = order.client_address_city;
      if (!acc[city]) {
        acc[city] = { count: 0, revenue: 0 };
      }
      acc[city].count += 1;
      acc[city].revenue += parseFloat(order.order_final_price);
      return acc;
    }, {} as Record<string, { count: number, revenue: number }>);

    // Plot markers
    Object.entries(cityData).forEach(([city, data]) => {
      const coords = CITY_COORDINATES[city];
      if (coords) {
        // Calculate radius based on count (min 5, max 25)
        const radius = Math.max(6, Math.min(25, Math.sqrt(data.count) * 4));
        
        const marker = L.circleMarker(coords, {
          radius: radius,
          fillColor: '#3B82F6',
          color: '#2563EB',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6
        })
        .bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-sm text-gray-900">${city}</h3>
            <p class="text-xs text-gray-600">Pedidos: <b>${data.count}</b></p>
            <p class="text-xs text-gray-600">Receita: <b>R$ ${data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</b></p>
          </div>
        `);

        marker.addTo(mapInstanceRef.current!);
        markersRef.current.push(marker);
      }
    });

  }, [orders]);

  return (
    <div className="h-full w-full relative z-0">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
    </div>
  );
};

export default DeliveryMap;