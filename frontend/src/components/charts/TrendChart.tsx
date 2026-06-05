import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CommodityTrend } from '../../services/api';
import { format } from 'date-fns';

interface Props { trend: CommodityTrend | null; loading: boolean; }

const TrendChart: React.FC<Props> = ({ trend, loading }) => {
  if (loading) {
    return <div className="h-64 flex items-center justify-center">
      <div className="skeleton h-48 w-full rounded-lg"/>
    </div>;
  }

  if (!trend || trend.trendData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        Select a commodity and click Go to see price trends
      </div>
    );
  }

  const data = trend.trendData.map(d => ({
    ...d,
    date: format(new Date(d.date), 'dd MMM'),
    minPrice: Number(d.minPrice),
    maxPrice: Number(d.maxPrice),
    modalPrice: Number(d.modalPrice),
    arrivalQuantity: Number(d.arrivalQuantity),
  }));

  return (
    <div className="fade-in space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">{trend.commodityName} — Price Trend</h3>
            <p className="text-xs text-gray-500">{trend.marketName} · {trend.stateName}</p>
          </div>
          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
            Last {data.length} days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f1"/>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false}/>
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => `₹${v.toLocaleString('en-IN')}`}/>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #d4e4d8' }}
              formatter={(v: number, name: string) => [`₹${v.toLocaleString('en-IN')}`, name]}/>
            <Legend wrapperStyle={{ fontSize: 12 }}/>
            <Line type="monotone" dataKey="minPrice" stroke="#dc2626" strokeWidth={1.5}
              dot={false} name="Min Price"/>
            <Line type="monotone" dataKey="modalPrice" stroke="#1a5c2a" strokeWidth={2.5}
              dot={{ r: 3 }} activeDot={{ r: 5 }} name="Modal Price"/>
            <Line type="monotone" dataKey="maxPrice" stroke="#16a34a" strokeWidth={1.5}
              dot={false} name="Max Price"/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Arrival Quantity (Quintals)</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f1" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false}/>
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(v: number) => [v.toFixed(1) + ' Qtl', 'Arrival']}/>
            <Bar dataKey="arrivalQuantity" fill="#44a058" radius={[3, 3, 0, 0]} name="Arrival"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
