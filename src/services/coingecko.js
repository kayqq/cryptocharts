import axios from 'axios';

// Rate Limit: 100 requests/minute
const axiosInstance = axios.create({
  baseURL: `https://api.coingecko.com/api/v3`,
});

export const getCoins = async () => {
  const res = await axiosInstance.get('/coins/list');
  return res.data;
};

export const getCoinData = async coinId => {
  const res = await axiosInstance.get(`/coins/${coinId}`);
  return res.data;
};

export const getMarketChart = async (
  id,
  vsCurrency = 'usd',
  daysAgo = '365'
) => {
  const res = await axiosInstance.get(
    `/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${daysAgo}`
  );
  return res.data.prices;
};
