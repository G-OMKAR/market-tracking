import React, { useEffect, useState } from 'react';
import { priceApi, DashboardStats } from '../../services/api';
import { Database, MapPin, ShoppingBasket, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

const StatsBar: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    priceApi.getStats().then(setStats).catch(() => {});
  }, []);

  const items = stats ? [
    { icon: <Database size={16}/>, label: 'Total Records', value: stats.totalRecords.toLocaleString('en-IN'), color: 'text-blue-600' },
    { icon: <MapPin size={16}/>, label: 'States Covered', value: stats.totalStates.toString(), color: 'text-green-600' },
    { icon: <BarChart2 size={16}/>, label: 'Markets', value: stats.totalMarkets.toLocaleString('en-IN'), color: 'text-amber-600' },
    { icon: <ShoppingBasket size={16}/>, label: 'Commodities', value: stats.totalCommodities.toString(), color: 'text-purple-600' },
  ] : [];

  if (!stats) return null;

  return (
    <div className="bg-white border-b border-green-100 px-6 py-3">
      <div className="flex flex-wrap gap-8 items-center">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={item.color}>{item.icon}</span>
            <div>
              <div className="font-bold text-gray-800 text-sm leading-tight">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          </div>
        ))}
        {stats.latestDataDate && (
          <div className="ml-auto text-xs text-gray-400">
            Data frozen up to{' '}
            <strong className="text-gray-600">
              {format(new Date(stats.latestDataDate), 'dd MMM yyyy')}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsBar;
