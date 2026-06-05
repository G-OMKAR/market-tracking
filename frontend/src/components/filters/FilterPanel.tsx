import React, { useEffect, useState } from 'react';
import { refApi, State, District, Market, CommodityGroup, Commodity, Variety } from '../../services/api';
import { Search, RotateCcw } from 'lucide-react';

export interface FilterValues {
  stateId?: number;
  districtId?: number;
  marketId?: number;
  commodityGroupId?: number;
  commodityId?: number;
  varietyId?: number;
  grade: string;
  fromDate: string;
  toDate: string;
}

interface Props {
  onSearch: (filters: FilterValues) => void;
  loading: boolean;
}

const GRADES = ['All Grades', 'FAQ', 'Grade-A', 'Super'];
const today = new Date().toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

const FilterPanel: React.FC<Props> = ({ onSearch, loading }) => {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [groups, setGroups] = useState<CommodityGroup[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);

 const [filters, setFilters] = useState<FilterValues>({
  grade: '',
  fromDate: '',
  toDate: '',
});

  useEffect(() => {
    refApi.getStates().then(setStates);
    refApi.getCommodityGroups().then(setGroups);
    refApi.getCommodities().then(setCommodities);
    refApi.getMarkets().then(setMarkets);
  }, []);

  const handleStateChange = async (stateId: number) => {
    const id = stateId || undefined;
    setFilters(f => ({ ...f, stateId: id, districtId: undefined, marketId: undefined }));
    setDistricts(id ? await refApi.getDistricts(id) : []);
    setMarkets(await refApi.getMarkets(id, undefined));
  };

  const handleDistrictChange = async (districtId: number) => {
    const id = districtId || undefined;
    setFilters(f => ({ ...f, districtId: id, marketId: undefined }));
    setMarkets(await refApi.getMarkets(filters.stateId, id));
  };

  const handleGroupChange = async (groupId: number) => {
    const id = groupId || undefined;
    setFilters(f => ({ ...f, commodityGroupId: id, commodityId: undefined, varietyId: undefined }));
    setCommodities(await refApi.getCommodities(id));
    setVarieties([]);
  };

  const handleCommodityChange = async (commodityId: number) => {
    const id = commodityId || undefined;
    setFilters(f => ({ ...f, commodityId: id, varietyId: undefined }));
    setVarieties(id ? await refApi.getVarieties(id) : []);
  };

  const reset = () => {
    setFilters({ grade: 'FAQ', fromDate: threeDaysAgo, toDate: today });
    setDistricts([]);
    setMarkets([]);
    setVarieties([]);
    refApi.getCommodities().then(setCommodities);
    refApi.getMarkets().then(setMarkets);
  };

  const set = (key: keyof FilterValues, val: any) =>
    setFilters(f => ({ ...f, [key]: val || undefined }));

  return (
    <div className="bg-white border-b border-green-100 shadow-sm">
      {/* Tabs */}
      <div className="px-6 flex border-b border-gray-200 gap-8">
        <div className="tab-active py-3 text-sm">
          Market Wise Price &amp; Arrival
          
        </div>
        {/* <button className="tab-inactive py-3 text-sm">
          Crop Season Wise Price &amp; Arrival
          <span className="block text-xs font-normal text-gray-400">(MSP Commodities)</span>
        </button> */}
      </div>

      {/* Filter Row */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* State */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-gray-500 font-medium">State</label>
            <select className="filter-select" value={filters.stateId || ''}
              onChange={e => handleStateChange(+e.target.value)}>
              <option value="">All States</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* District */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-gray-500 font-medium">District</label>
            <select className="filter-select" value={filters.districtId || ''}
              onChange={e => handleDistrictChange(+e.target.value)}
              disabled={!filters.stateId && districts.length === 0}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {/* Market */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-xs text-gray-500 font-medium">Market</label>
            <select className="filter-select" value={filters.marketId || ''}
              onChange={e => set('marketId', +e.target.value)}>
              <option value="">All Markets</option>
              {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          {/* Commodity Group */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-xs text-gray-500 font-medium">Commodity Group</label>
            <select className="filter-select" value={filters.commodityGroupId || ''}
              onChange={e => handleGroupChange(+e.target.value)}>
              <option value="">All Commodity Groups</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          {/* Commodity */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-xs text-gray-500 font-medium">Commodity</label>
            <select className="filter-select" value={filters.commodityId || ''}
              onChange={e => handleCommodityChange(+e.target.value)}>
              <option value="">All Commodities</option>
              {commodities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Variety */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-gray-500 font-medium">Variety</label>
            <select className="filter-select" value={filters.varietyId || ''}
              onChange={e => set('varietyId', +e.target.value)}
              disabled={varieties.length === 0}>
              <option value="">All Varieties</option>
              {varieties.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          {/* Grade */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-xs text-gray-500 font-medium">Grade</label>
            <select className="filter-select" value={filters.grade}
              onChange={e => set('grade', e.target.value)}>
              {GRADES.map(g => <option key={g} value={g === 'All Grades' ? '' : g}>{g}</option>)}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">From Date</label>
            <input type="date" className="filter-select" value={filters.fromDate || ''}
              onChange={e => set('fromDate', e.target.value)} max={today}/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">To Date</label>
            <input type="date" className="filter-select" value={filters.toDate || ''}
              onChange={e => set('toDate', e.target.value)} max={today}/>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-auto">
            <button className="btn-primary flex items-center gap-2"
              onClick={() => onSearch(filters)} disabled={loading}>
              <Search size={15}/>
              {loading ? 'Loading...' : 'Go'}
            </button>
            <button className="btn-secondary flex items-center gap-2" onClick={reset}>
              <RotateCcw size={14}/>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
