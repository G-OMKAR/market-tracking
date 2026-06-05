import React, { useEffect, useState } from 'react';

import { LineChart } from 'lucide-react';

import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import {
  priceApi,
  PriceArrival
} from '../services/api';

const MarketReports: React.FC = () => {

  const [reportData, setReportData] =
    useState<PriceArrival[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedCommodity, setSelectedCommodity] =
    useState('Wheat');

  useEffect(() => {

    loadReport();

  }, [selectedCommodity]);

  const loadReport = async () => {

    setLoading(true);

    try {

      const response =
        await priceApi.getPrices({

          page: 0,
          size: 10000

        });

      const filtered =
        response.content.filter(

          (item: any) =>

            item.commodityName
              ?.toLowerCase()
              .includes(

                selectedCommodity
                  .toLowerCase()

              )

        );

      setReportData(filtered);

    } catch (err) {

      console.error(
        'Error loading report',
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // ---------------------------------------------------
  // MARKET ANALYSIS
  // ---------------------------------------------------

  const marketMap: any = {};

  reportData.forEach((item: any) => {

    const key =
      `${item.marketName}-${item.stateName}`;

    if (!marketMap[key]) {

      marketMap[key] = {

        name:
          item.marketName,

        state:
          item.stateName,

        totalPrice: 0,

        totalArrival: 0,

        count: 0
      };
    }

    marketMap[key]
      .totalPrice +=
      Number(item.modalPrice || 0);

    marketMap[key]
      .totalArrival +=
      Number(item.arrivalQuantity || 0);

    marketMap[key]
      .count += 1;

  });

  const marketData =
    Object.values(marketMap)
      .map((item: any) => ({

        name:
          item.name,

        state:
          item.state,

        avgPrice:
          Math.round(
            item.totalPrice /
            item.count
          ),

        totalArrival:
          item.totalArrival,

        totalRecords:
          item.count

      }));

  // ---------------------------------------------------
  // SMART INSIGHTS
  // ---------------------------------------------------

  const highestMarket =
    [...marketData]

      .sort(

        (a: any, b: any) =>

          b.avgPrice -
          a.avgPrice

      )[0];

  const mostActiveMarket =
    [...marketData]

      .sort(

        (a: any, b: any) =>

          b.totalArrival -
          a.totalArrival

      )[0];

  // ---------------------------------------------------
  // STATE ANALYSIS
  // ---------------------------------------------------

  const stateMap: any = {};

  marketData.forEach((item: any) => {

    if (!stateMap[item.state]) {

      stateMap[item.state] = {

        total: 0,
        count: 0

      };
    }

    stateMap[item.state]
      .total +=
      item.avgPrice;

    stateMap[item.state]
      .count += 1;

  });

  const stateStats =
    Object.entries(stateMap)
      .map(

        ([state, value]: any) => ({

          state,

          avgPrice:
            Math.round(

              value.total /
              value.count

            )

        })

      );

  const bestState =
    [...stateStats]

      .sort(

        (a: any, b: any) =>

          b.avgPrice -
          a.avgPrice

      )[0];

  // ---------------------------------------------------
  // CHART DATA
  // ---------------------------------------------------

  const chartData =
    [...marketData]

      .sort(

        (a: any, b: any) =>

          b.avgPrice -
          a.avgPrice

      )

      .slice(0, 8);

  return (

    <div className="
      p-6
      bg-gray-50
      min-h-screen
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
            text-gray-800
          ">
            Market Reports
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Smart agricultural market analysis and insights
          </p>

        </div>

        {/* SELECT */}

        <select

          value={selectedCommodity}

          onChange={(e) =>
            setSelectedCommodity(
              e.target.value
            )
          }

          className="
            border
            border-gray-300
            rounded-xl
            px-5
            py-3
            bg-white
            shadow-sm
          "
        >

          <option>Wheat</option>
          <option>Rice</option>
          <option>Tomato</option>
          <option>Potato</option>
          <option>Onion</option>

        </select>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="
          text-lg
          text-gray-600
          mb-6
        ">
          Loading report...
        </div>

      )}

      {/* ANALYTICS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        mb-8
      ">

        {/* HIGHEST */}

        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border-t-4
          border-red-500
          border-x
          border-b
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Highest Price Market
          </h3>

          <p className="
            text-2xl
            font-bold
            text-red-600
          ">
            {highestMarket?.name || '-'}
          </p>

          <p className="
            text-gray-500
            mt-1
          ">
            {highestMarket?.state}
          </p>

          <p className="
            text-2xl
            font-bold
            mt-4
          ">
            ₹{highestMarket?.avgPrice || 0} / Quintal
          </p>

        </div>

        {/* ACTIVE */}

        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border-t-4
          border-blue-500
          border-x
          border-b
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Most Active Market
          </h3>

          <p className="
            text-2xl
            font-bold
            text-blue-600
          ">
            {mostActiveMarket?.name || '-'}
          </p>

          <p className="
            text-gray-500
            mt-1
          ">
            {mostActiveMarket?.state}
          </p>

          <p className="
            text-2xl
            font-bold
            mt-4
          ">
            {Math.round(
              mostActiveMarket
                ?.totalArrival || 0
            )} Quintals
          </p>

        </div>

        {/* STATE */}

        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border-t-4
          border-purple-500
          border-x
          border-b
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Best Performing State
          </h3>

          <p className="
            text-2xl
            font-bold
            text-purple-600
          ">
            {bestState?.state || '-'}
          </p>

          <p className="
            text-gray-500
            mt-1
          ">
            Avg Price Leader
          </p>

          <p className="
            text-2xl
            font-bold
            mt-4
          ">
            ₹{bestState?.avgPrice || 0} / Quintal
          </p>

        </div>

      </div>

      {/* CHART */}

      <div className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-6
      ">

        <div className="
          flex
          items-center
          gap-2
          mb-6
        ">

          <LineChart
            size={20}
            className="
              text-green-700
            "
          />

          <h2 className="
            text-2xl
            font-semibold
            text-gray-800
          ">
            Top Market Prices
          </h2>

        </div>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={chartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="avgPrice"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
};

export default MarketReports;