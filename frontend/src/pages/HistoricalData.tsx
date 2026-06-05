import React, { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import {
  priceApi,
  CommodityTrend,
  refApi,
  Commodity
} from '../services/api';

const HistoricalData = () => {

  const [trend, setTrend] = useState<CommodityTrend | null>(null);

  const [commodities, setCommodities] = useState<Commodity[]>([]);

  const [selectedCommodity, setSelectedCommodity] =
    useState<number>(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadCommodities();

  }, []);

  useEffect(() => {

    if (commodities.length > 0) {

      loadTrend();
    }

  }, [selectedCommodity, commodities]);

  const loadCommodities = async () => {

    try {

      const data = await refApi.getCommodities();

      setCommodities(data);

    } catch (err) {

      console.error(err);
    }
  };

  const loadTrend = async () => {

    setLoading(true);

    try {

      const data = await priceApi.getTrends(
        selectedCommodity,
        undefined,
        undefined,
        30
      );

      console.log('Trend API Response:', data);

      setTrend(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  const selectedCommodityName = commodities.find(

    (c) => c.id === selectedCommodity

  )?.name;

  return (

    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Historical Data
          </h1>

          <p className="text-gray-500 mt-2">
            Analyze historical commodity price trends
          </p>

        </div>

        {/* Commodity Selector */}
        <select
          value={selectedCommodity}
          onChange={(e) =>
            setSelectedCommodity(Number(e.target.value))
          }
          className="border border-gray-300 rounded-xl px-5 py-3 bg-white shadow-sm"
        >

          {commodities.map((commodity) => (

            <option
              key={commodity.id}
              value={commodity.id}
            >
              {commodity.id} - {commodity.name}
            </option>

          ))}

        </select>

      </div>

      {/* Loading */}
      {loading && (

        <div className="text-lg text-gray-600 mb-6">
          Loading trend data...
        </div>

      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm mb-2">
            Commodity
          </h2>

          <p className="text-3xl font-bold text-green-700">

            {selectedCommodityName || 'N/A'}

          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm mb-2">
            Market
          </h2>

          <p className="text-3xl font-bold text-blue-700">

            {trend?.marketName || 'All Markets'}

          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm mb-2">
            State
          </h2>

          <p className="text-3xl font-bold text-orange-600">

            {trend?.stateName || 'All States'}

          </p>

        </div>

      </div>

      {/* Empty Data */}
      {trend?.trendData?.length === 0 && (

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl mb-6">

          No historical trend data available for this commodity.

        </div>

      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-6">

          {selectedCommodityName || 'Commodity'} Price Trend

        </h2>

        <ResponsiveContainer width="100%" height={450}>

          <LineChart data={trend?.trendData || []}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="modalPrice"
              stroke="#16a34a"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default HistoricalData;