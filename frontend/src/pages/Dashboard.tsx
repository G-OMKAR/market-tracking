import React, { useState } from 'react';

import FilterPanel, {
  FilterValues
} from '../components/filters/FilterPanel';

import PriceTable from '../components/tables/PriceTable';

import TrendChart from '../components/charts/TrendChart';

import StatsBar from '../components/layout/StatsBar';

import Downloads from '../pages/Downloads';

import {
  priceApi,
  PaginatedPrices,
  CommodityTrend
} from '../services/api';

import {
  LineChart,
  X
} from 'lucide-react';

const Dashboard: React.FC = () => {

  const [tableData, setTableData] =
    useState<PaginatedPrices | null>(null);

  const [trend, setTrend] =
    useState<CommodityTrend | null>(null);

  const [loadingTable, setLoadingTable] =
    useState(false);

  const [loadingTrend, setLoadingTrend] =
    useState(false);

  const [currentFilters, setCurrentFilters] =
    useState<FilterValues | null>(null);

  const [showTrend, setShowTrend] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(0);

  // ---- Search ----

  const handleSearch = async (
    filters: FilterValues
  ) => {

    setCurrentFilters(filters);

    setCurrentPage(0);

    setLoadingTable(true);

    try {

      const data =
        await priceApi.getPrices({

          stateId:
            filters.stateId,

          districtId:
            filters.districtId,

          marketId:
            filters.marketId,

          commodityGroupId:
            filters.commodityGroupId,

          commodityId:
            filters.commodityId,

          varietyId:
            filters.varietyId,

          grade:
            filters.grade || undefined,

          fromDate:
            filters.fromDate,

          toDate:
            filters.toDate,

          page: 0,

          size: 50,
        });

      setTableData(data);

    } catch (err) {

      console.error(
        'Error fetching prices',
        err
      );

    } finally {

      setLoadingTable(false);
    }

    // ---- Trend Loading ----

    if (filters.commodityId) {

      setLoadingTrend(true);

      try {

        const trendData =
          await priceApi.getTrends(

            filters.commodityId,

            filters.marketId,

            filters.stateId,

            30
          );

        setTrend(trendData);

        setShowTrend(true);

      } catch (err) {

        console.error(
          'Error fetching trends',
          err
        );

      } finally {

        setLoadingTrend(false);
      }

    } else {

      setShowTrend(false);
    }
  };

  // ---- Pagination ----

  const handlePageChange = async (
    page: number
  ) => {

    if (!currentFilters) return;

    setCurrentPage(page);

    setLoadingTable(true);

    try {

      const data =
        await priceApi.getPrices({

          stateId:
            currentFilters.stateId,

          districtId:
            currentFilters.districtId,

          marketId:
            currentFilters.marketId,

          commodityGroupId:
            currentFilters.commodityGroupId,

          commodityId:
            currentFilters.commodityId,

          varietyId:
            currentFilters.varietyId,

          grade:
            currentFilters.grade || undefined,

          fromDate:
            currentFilters.fromDate,

          toDate:
            currentFilters.toDate,

          page,

          size: 50,
        });

      setTableData(data);

    } catch (err) {

      console.error(
        'Error changing page',
        err
      );

    } finally {

      setLoadingTable(false);
    }
  };

  return (

    <div className="
      flex
      flex-col
      min-h-screen
      bg-gray-50
    ">

      {/* Top Stats */}
      <StatsBar />

      {/* Filters */}
      <FilterPanel
        onSearch={handleSearch}
        loading={loadingTable}
      />

      {/* Main Content */}
      <div className="
        flex-1
        p-4
        md:p-6
        space-y-6
      ">

        {/* Table Section */}
        <div className="
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-sm
          overflow-hidden
        ">

          {/* Header */}
          <div className="
            px-4
            py-3
            border-b
            border-gray-100
            flex
            items-center
            justify-between
          ">

            <h2 className="
              font-semibold
              text-gray-700
              text-sm
            ">

              {currentFilters
                ? 'Price & Arrival Data'
                : 'Market Price Dashboard'}

            </h2>

            {tableData &&
              tableData.totalElements > 0 && (

              <span className="
                text-xs
                bg-green-50
                text-green-700
                px-3
                py-1
                rounded-full
                border
                border-green-100
              ">

                {tableData.totalElements}
                {' '}
                records found

              </span>
            )}

          </div>

          {/* Table */}
          <PriceTable
            data={tableData}
            loading={loadingTable}
            onPageChange={handlePageChange}
          />

          {/* Pagination */}
          {tableData &&
            tableData.totalPages > 1 && (

            <div className="
              flex
              items-center
              justify-center
              gap-4
              p-4
              border-t
              border-gray-100
            ">

              <button

                disabled={currentPage === 0}

                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }

                className="
                  bg-green-600
                  hover:bg-green-700
                  disabled:bg-gray-300
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  transition-colors
                "
              >
                Previous
              </button>

              <span className="
                font-medium
                text-gray-700
              ">

                Page
                {' '}
                {currentPage + 1}
                {' '}
                of
                {' '}
                {tableData.totalPages}

              </span>

              <button

                disabled={
                  currentPage + 1 >=
                  tableData.totalPages
                }

                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }

                className="
                  bg-green-600
                  hover:bg-green-700
                  disabled:bg-gray-300
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  transition-colors
                "
              >
                Next
              </button>

            </div>
          )}

        </div>

        {/* Downloads */}
        {tableData &&
          tableData.content.length > 0 && (

          <Downloads
            data={tableData.content}
          />

        )}

        {/* Commodity Analysis */}
        {tableData &&
          tableData.content.length > 0 && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          ">

            {/* Highest Price */}
            <div className="
              bg-white
              rounded-xl
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
                Highest Modal Price
              </h3>

              <p className="
                text-3xl
                font-bold
                text-red-600
              ">

                ₹{
                  Math.max(
                    ...tableData.content.map(
                      item =>
                        Number(
                          item.modalPrice
                        )
                    )
                  )
                } / Quintal

              </p>

            </div>

            {/* Lowest Price */}
            <div className="
              bg-white
              rounded-xl
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
                Lowest Modal Price
              </h3>

              <p className="
                text-3xl
                font-bold
                text-green-600
              ">

                ₹{
                  Math.min(
                    ...tableData.content.map(
                      item =>
                        Number(
                          item.modalPrice
                        )
                    )
                  )
                } / Quintal

              </p>

            </div>

            {/* Average Price */}
            <div className="
              bg-white
              rounded-xl
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
                Average Modal Price
              </h3>

              <p className="
                text-3xl
                font-bold
                text-blue-600
              ">

                ₹{
                  Math.round(

                    tableData.content.reduce(
                      (sum, item) =>

                        sum +
                        Number(
                          item.modalPrice
                        ),

                      0
                    )

                    /

                    tableData.content.length
                  )
                } / Quintal

              </p>

            </div>

          </div>
        )}

        {/* Trend Chart */}
        {showTrend && (

          <div className="
            bg-white
            rounded-xl
            border
            border-gray-200
            shadow-sm
            overflow-hidden
            fade-in
          ">

            {/* Chart Header */}
            <div className="
              px-4
              py-3
              border-b
              border-gray-100
              flex
              items-center
              justify-between
            ">

              <div className="
                flex
                items-center
                gap-2
              ">

                <LineChart
                  size={16}
                  className="text-green-700"
                />

                <h2 className="
                  font-semibold
                  text-gray-700
                  text-sm
                ">
                  Price Trend Analysis
                </h2>

              </div>

              <button

                onClick={() =>
                  setShowTrend(false)
                }

                className="
                  p-1
                  hover:bg-gray-100
                  rounded
                  text-gray-400
                  hover:text-gray-600
                  transition-colors
                "
              >
                <X size={16}/>
              </button>

            </div>

            {/* Chart */}
            <div className="p-4">

              <TrendChart
                trend={trend}
                loading={loadingTrend}
              />

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;