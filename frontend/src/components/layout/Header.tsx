import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {

  const location = useLocation();

  const tabs = [

    {
      name: 'Price & Arrival Data',
      path: '/'
    },

    {
      name: 'Commodity Reports',
      path: '/commodity-reports'
    },

    {
      name: 'State-wise Analysis',
      path: '/state-analysis'
    },

    {
      name: 'Historical Data',
      path: '/historical-data'
    }

  ];

  return (

    <nav className="
      bg-green-700
      px-6
    ">

      <div className="
        flex
        gap-1
        text-sm
      ">

        {tabs.map((tab) => (

          <Link

            key={tab.name}

            to={tab.path}

            className={`

              px-4
              py-2.5
              font-medium
              transition-colors
              rounded-t-md

              ${location.pathname === tab.path

                ? 'bg-white text-green-800'

                : 'text-green-100 hover:text-white hover:bg-green-600'
              }

            `}
          >

            {tab.name}

          </Link>
        ))}

      </div>

    </nav>
  );
};

export default Header;