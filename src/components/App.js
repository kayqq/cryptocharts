import React, { Component } from 'react';

import CoinList from './CoinList';
import { getCoinData, getMarketChart } from '../services/coingecko';

const COLORS = [
  '#FF1744',
  '#D500F9',
  '#00E676',
  '#00E5FF',
  '#FFEA00',
  '#3D5AFE',
  '#F50057',
  '#651FFF',
  '#1DE9B6',
  '#C6FF00',
  '#FF3D00',
  '#00B0FF',
  '#76FF03',
  '#FFC400',
];

let lastColorIdx = 0;

const setStockColor = () => {
  const color = COLORS[lastColorIdx];
  lastColorIdx++;
  return color;
};

class App extends Component {
  state = {
    coins: [],
  };

  addCoin = async coin => {
    const { id } = coin;
    if (this.getCoin(id)) {
      const newCoin = await this.getCoin(id);
      this.setState({ coins: [...this.state.coins, newCoin] });
    }
  };

  getMeta = coin => {
    const { id, symbol, name } = coin;
    return {
      id: id,
      symbol: symbol,
      name: name,
      color: setStockColor(),
      display: true,
    };
  };

  getQuote = coin => {
    const { market_data } = coin;
    return {
      price: market_data.current_price.usd,
      change: market_data.price_change_24h,
      changePercent: market_data.price_change_percentage_24h_in_currency.usd,
    };
  };

  getCoin = async id => {
    const { coins } = this.state;

    const coinExists = coins.some(c => c.id === id);

    if (!coinExists) {
      const chart = getMarketChart(id);
      const coin = await getCoinData(id);
      const meta = this.getMeta(coin);
      const quote = this.getQuote(coin);

      return { ...meta, ...quote, chart: await chart };
    } else {
      return null;
    }
  };

  componentDidMount() {}

  render() {
    const { coins } = this.state;

    return (
      <div className="App">
        <div className="container-graph">Graph</div>
        <div className="container-coinlist">
          <CoinList coins={coins} addCoin={this.addCoin} />
        </div>
      </div>
    );
  }
}

export default App;
