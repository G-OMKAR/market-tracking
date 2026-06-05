import axios from 'axios';

const api = axios.create({
  baseURL: 'https://market-tracking.onrender.com/api/v1',
  timeout: 15000,
});

// ---- Types ----
export interface State { id: number; name: string; code: string; }
export interface District { id: number; name: string; stateId: number; stateName: string; }
export interface Market { id: number; name: string; districtId: number; districtName: string; stateName: string; }
export interface CommodityGroup { id: number; name: string; }
export interface Commodity { id: number; name: string; commodityGroupId: number; commodityGroupName: string; }
export interface Variety { id: number; name: string; commodityId: number; }

export interface PriceArrival {
  id: number;
  arrivalDate: string;
  stateName: string;
  districtName: string;
  marketName: string;
  commodityGroup: string;
  commodityName: string;
  variety: string;
  grade: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  priceUnit: string;
}

export interface PaginatedPrices {
  content: PriceArrival[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TrendPoint {
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
}

export interface CommodityTrend {
  commodityName: string;
  marketName: string;
  stateName: string;
  trendData: TrendPoint[];
}

export interface DashboardStats {
  totalRecords: number;
  totalStates: number;
  totalMarkets: number;
  totalCommodities: number;
  latestDataDate: string;
  oldestDataDate: string;
}

// ---- API calls ----
const unwrap = (res: any) => res.data.data;

export const refApi = {
  getStates: () => api.get('/reference/states').then(unwrap) as Promise<State[]>,
  getDistricts: (stateId?: number) => api.get('/reference/districts', { params: { stateId } }).then(unwrap) as Promise<District[]>,
  getMarkets: (stateId?: number, districtId?: number) => api.get('/reference/markets', { params: { stateId, districtId } }).then(unwrap) as Promise<Market[]>,
  getCommodityGroups: () => api.get('/reference/commodity-groups').then(unwrap) as Promise<CommodityGroup[]>,
  getCommodities: (groupId?: number) => api.get('/reference/commodities', { params: { groupId } }).then(unwrap) as Promise<Commodity[]>,
  getVarieties: (commodityId?: number) => api.get('/reference/varieties', { params: { commodityId } }).then(unwrap) as Promise<Variety[]>,
};

export interface FilterParams {
  stateId?: number;
  districtId?: number;
  marketId?: number;
  commodityGroupId?: number;
  commodityId?: number;
  varietyId?: number;
  grade?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export const priceApi = {
  getPrices: (params: FilterParams) => api.get('/prices', { params }).then(unwrap) as Promise<PaginatedPrices>,
  getTrends: (commodityId: number, marketId?: number, stateId?: number, days = 30) =>
    api.get('/prices/trends', { params: { commodityId, marketId, stateId, days } }).then(unwrap) as Promise<CommodityTrend>,
  getStats: () => api.get('/prices/stats').then(unwrap) as Promise<DashboardStats>,
};
