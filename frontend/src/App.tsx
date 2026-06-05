import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Dashboard from './pages/Dashboard';
import CommodityReports from './pages/CommodityReports';
import StateAnalysis from './pages/StateAnalysis';
import HistoricalData from './pages/HistoricalData';


const App: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/commodity-reports" element={<CommodityReports />} />
        <Route path="/state-analysis" element={<StateAnalysis />} />
        <Route path="/historical-data" element={<HistoricalData />} />
        
      </Routes>
    </main>

    <Footer />
  </div>
);

export default App;