import React from 'react';

import {
  PriceArrival
} from '../services/api';

interface Props {

  data: PriceArrival[];
}

const Downloads: React.FC<Props> = ({
  data
}) => {

  const handleDownload = () => {

    if (!data || data.length === 0) {

      alert('No data available');

      return;
    }

    const headers = [
      'Date',
      'State',
      'District',
      'Market',
      'Commodity',
      'Min Price',
      'Max Price',
      'Modal Price',
      'Arrival Quantity'
    ];

    const rows = data.map((item) => [

      item.arrivalDate,

      item.stateName,

      item.districtName,

      item.marketName,

      item.commodityName,

      item.minPrice,

      item.maxPrice,

      item.modalPrice,

      item.arrivalQuantity

    ]);

    const csvContent = [

      headers.join(','),

      ...rows.map((r) => r.join(','))

    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'market-data.csv';

    link.click();

    URL.revokeObjectURL(url);
  };

  return (

    <div className="p-6">

      <div className="
        bg-white
        rounded-2xl
        shadow-md
        p-8
        text-center
      ">

        <h1 className="
          text-4xl
          font-bold
          mb-4
          text-gray-800
        ">
          Download Market Data
        </h1>

        <p className="
          text-gray-500
          mb-8
        ">
          Export filtered commodity
          market data as CSV
        </p>

        <button
          onClick={handleDownload}
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-8
            py-4
            rounded-xl
            text-lg
            font-semibold
            transition-colors
          "
        >
          Download CSV
        </button>

      </div>

    </div>
  );
};

export default Downloads;