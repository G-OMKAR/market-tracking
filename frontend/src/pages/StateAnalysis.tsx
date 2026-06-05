import React, {
  useEffect,
  useState
} from 'react';

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid

} from 'recharts';

import {
  priceApi,
  PriceArrival
} from '../services/api';

interface StateAnalytics {

  rank: number;

  state: string;

  avgPrice: number;

  markets: number;

  trend: string;

  status: string;
}

const StateWiseAnalysis: React.FC = () => {

  const [stateData, setStateData] =
    useState<StateAnalytics[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    loadAnalysis();

  }, []);

  const loadAnalysis = async () => {

    setLoading(true);

    try {

      const response =
        await priceApi.getPrices({

          page: 0,
          size: 1000

        });

      const groupedStates: any = {};

      response.content.forEach(

        (item: PriceArrival) => {

          const state =
            item.stateName;

          if (!groupedStates[state]) {

            groupedStates[state] = {

              state,

              totalPrice: 0,

              count: 0,

              markets: new Set()

            };
          }

          groupedStates[state]
            .totalPrice +=
            Number(item.modalPrice);

          groupedStates[state]
            .count += 1;

          groupedStates[state]
            .markets.add(
              item.marketName
            );
        }
      );

      const calculatedData =
        Object.values(groupedStates)

          .map((item: any) => {

            const avgPrice =
              Math.round(

                item.totalPrice /
                item.count
              );

            let trend = 'Stable';

            let status = 'Stable';

            if (avgPrice > 3000) {

              trend = 'Rising';

              status =
                'High Demand';

            } else if (
              avgPrice > 2500
            ) {

              trend = 'Growing';

              status =
                'Expanding';

            } else if (
              avgPrice < 2200
            ) {

              trend = 'Falling';

              status =
                'Bulk Supply';
            }

            return {

              state:
                item.state,

              avgPrice,

              markets:
                item.markets.size,

              trend,

              status
            };
          })

          .sort(

            (a: any, b: any) =>

              b.avgPrice -
              a.avgPrice

          )

          .map(

            (item: any, index) => ({

              ...item,

              rank: index + 1
            })
          );

      setStateData(
        calculatedData
      );

    } catch (err) {

      console.error(
        'Error loading state analysis',
        err
      );

    } finally {

      setLoading(false);
    }
  };

  const highestPriceState =
    stateData[0];

  const cheapestState =
    [...stateData].sort(

      (a, b) =>

        a.avgPrice -
        b.avgPrice

    )[0];

  const mostActiveState =
    [...stateData].sort(

      (a, b) =>

        b.markets -
        a.markets

    )[0];

  const avgCommodityPrice =
    Math.round(

      stateData.reduce(

        (sum, item) =>

          sum + item.avgPrice,

        0

      ) /

      (stateData.length || 1)
    );

  return (

    <div className="
      p-6
      bg-gray-50
      min-h-screen
    ">

      {/* Header */}
      <div className="mb-8">

        <h1 className="
          text-4xl
          font-bold
          text-gray-800
        ">
          State-wise Market Intelligence
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Real-time commodity
          intelligence across states
        </p>

      </div>

      {/* Loading */}
      {loading && (

        <div className="
          text-lg
          text-gray-600
          mb-6
        ">
          Loading analysis...
        </div>

      )}

      {/* Smart Cards */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-8
      ">

        {/* Premium State */}
        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Premium Market State
          </h3>

          <p className="
            text-2xl
            font-bold
            text-red-600
          ">
            {
              highestPriceState
                ?.state
            }
          </p>

          <p className="
            text-gray-500
            mt-2
          ">
            ₹{
              highestPriceState
                ?.avgPrice
            } / Quintal
          </p>

        </div>

        {/* Cheapest */}
        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Best Buying State
          </h3>

          <p className="
            text-2xl
            font-bold
            text-green-600
          ">
            {
              cheapestState
                ?.state
            }
          </p>

          <p className="
            text-gray-500
            mt-2
          ">
            ₹{
              cheapestState
                ?.avgPrice
            } / Quintal
          </p>

        </div>

        {/* Active */}
        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            Most Active State
          </h3>

          <p className="
            text-2xl
            font-bold
            text-blue-600
          ">
            {
              mostActiveState
                ?.state
            }
          </p>

          <p className="
            text-gray-500
            mt-2
          ">
            {
              mostActiveState
                ?.markets
            }
            {' '}
            markets
          </p>

        </div>

        {/* Avg Price */}
        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          p-6
        ">

          <h3 className="
            text-sm
            text-gray-500
            mb-2
          ">
            National Avg Price
          </h3>

          <p className="
            text-3xl
            font-bold
            text-purple-600
          ">
            ₹{
              avgCommodityPrice
            } / Quintal
          </p>

        </div>

      </div>

      {/* Ranking Table */}
      <div className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        overflow-hidden
        mb-8
      ">

        <div className="
          px-6
          py-4
          border-b
          border-gray-100
        ">

          <h2 className="
            text-2xl
            font-semibold
            text-gray-800
          ">
            State Market Rankings
          </h2>

        </div>

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            text-sm
          ">

            <thead className="
              bg-gray-50
            ">

              <tr>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  Rank
                </th>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  State
                </th>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  Avg Price
                </th>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  Markets
                </th>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  Trend
                </th>

                <th className="
                  px-4
                  py-3
                  text-left
                ">
                  Market Health
                </th>

              </tr>

            </thead>

            <tbody>

              {stateData.map(

                (item, index) => (

                  <tr
                    key={index}
                    className="
                      border-t
                      border-gray-100
                      hover:bg-gray-50
                    "
                  >

                    <td className="
                      px-4
                      py-3
                      font-bold
                    ">
                      #{item.rank}
                    </td>

                    <td className="
                      px-4
                      py-3
                      font-medium
                    ">
                      {item.state}
                    </td>

                    <td className="
                      px-4
                      py-3
                      text-green-700
                      font-semibold
                    ">
                      ₹{
                        item.avgPrice
                      } / Quintal
                    </td>

                    <td className="
                      px-4
                      py-3
                    ">
                      {item.markets}
                    </td>

                    <td className="
                      px-4
                      py-3
                      font-medium
                    ">
                      {item.trend}
                    </td>

                    <td className="
                      px-4
                      py-3
                    ">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          inline-flex
                          items-center

                          ${item.status.includes('High')
                            ? 'bg-red-100 text-red-700'

                            : item.status.includes('Expanding')
                            ? 'bg-blue-100 text-blue-700'

                            : item.status.includes('Stable')
                            ? 'bg-green-100 text-green-700'

                            : 'bg-orange-100 text-orange-700'
                          }
                        `}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Chart */}
      <div className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-6
          text-gray-800
        ">
          Average Commodity Prices by State
        </h2>

        <ResponsiveContainer
          width="100%"
          height={420}
        >

          <BarChart
            data={stateData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="state"
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

export default StateWiseAnalysis;