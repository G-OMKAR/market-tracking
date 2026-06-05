import React from 'react';
import { PriceArrival, PaginatedPrices } from '../../services/api';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  data: PaginatedPrices | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRowClick?: (row: PriceArrival) => void;
}

const GRADE_STYLE: Record<string, string> = {
  'FAQ': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Grade-A': 'bg-green-50 text-green-700 border border-green-200',
  'Super': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 11 }).map((_, i) => (
      <td key={i} className="px-3 py-3"><div className="skeleton h-4 w-full"/></td>
    ))}
  </tr>
);

const PriceTable: React.FC<Props> = ({ data, loading, onPageChange, onRowClick }) => {
  if (!loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
          <TrendingUp size={24} className="text-gray-300"/>
        </div>
        <p className="text-base font-medium text-gray-500">Ready to Load Data</p>
        <p className="text-sm mt-1">Select your filters and click the <strong>"Go"</strong> button to load the dashboard</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Summary bar */}
      {data && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-800 flex items-center gap-2">
          <span className="font-semibold">Results:</span>
          <span>Showing <strong>{data.content.length}</strong> of <strong>{data.totalElements}</strong> records</span>
          <span className="text-amber-400">|</span>
          <span>Data shown is for the selected period</span>
          <span className="ml-auto font-medium text-green-700">Prices in ₹ per quintal</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="price-table w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left whitespace-nowrap">#</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">Date</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">State</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">District</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">Market</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">Commodity</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">Variety</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">Grade</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">Min Price (₹)</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">Max Price (₹)</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">Modal Price (₹)</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">Arrival (Qtl)</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i}/>)
              : data?.content.map((row, idx) => (
                <tr key={row.id}
                  className="border-b border-gray-100 cursor-pointer transition-colors"
                  onClick={() => onRowClick?.(row)}>
                  <td className="px-3 py-2.5 text-gray-400 text-xs">
                    {(data.currentPage * data.pageSize) + idx + 1}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-gray-700 whitespace-nowrap">
                    {format(new Date(row.arrivalDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700">{row.stateName}</td>
                  <td className="px-3 py-2.5 text-gray-600">{row.districtName}</td>
                  <td className="px-3 py-2.5 font-medium text-green-800">{row.marketName}</td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800">{row.commodityName}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.variety}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GRADE_STYLE[row.grade] || 'bg-gray-100 text-gray-600'}`}>
                      {row.grade}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-red-600 font-medium">
                    {row.minPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5 text-right text-green-700 font-medium">
                    {row.maxPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-800">
                    {row.modalPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5 text-right text-amber-700 font-medium">
                    {row.arrivalQuantity?.toFixed(1)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-500">
            Page {data.currentPage + 1} of {data.totalPages} &nbsp;·&nbsp;
            {data.totalElements} total records
          </span>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded hover:bg-white border border-gray-200 disabled:opacity-40"
              onClick={() => onPageChange(data.currentPage - 1)}
              disabled={data.currentPage === 0}>
              <ChevronLeft size={16}/>
            </button>
            {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
              const p = data.currentPage <= 3
                ? i
                : data.currentPage + i - 3;
              if (p >= data.totalPages) return null;
              return (
                <button key={p}
                  className={`w-7 h-7 text-xs rounded ${p === data.currentPage ? 'bg-green-700 text-white font-bold' : 'hover:bg-white border border-gray-200'}`}
                  onClick={() => onPageChange(p)}>
                  {p + 1}
                </button>
              );
            })}
            <button
              className="p-1.5 rounded hover:bg-white border border-gray-200 disabled:opacity-40"
              onClick={() => onPageChange(data.currentPage + 1)}
              disabled={data.currentPage >= data.totalPages - 1}>
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTable;
