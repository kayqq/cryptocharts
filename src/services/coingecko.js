import axios from 'axios';

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
  // const { id, symbol, name, market_data } = res.data;
  // return {
  //   id: id,
  //   symbol: symbol,
  //   name: name,
  //   price: market_data.current_price.usd,
  //   change: market_data.price_change_24h,
  //   changePercent: market_data.price_change_percentage_24h_in_currency.usd,
  // };
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
