import React, { Component } from 'react';

import CoinList from './CoinList';
import { getCoinData, getMarketChart } from '../services/coingecko';
import Graph from './Graph';

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

  toggleVisibility = id => {
    const { coins } = this.state;
    this.setState({
      coins: coins.map(c => {
        if (c.id == id) c.display = !c.display;
        return c;
      }),
    });
  };

  addCoin = async id => {
    const { coins } = this.state;
    const coinExists = coins.some(c => c.id === id);

    if (!coinExists) {
      const newCoin = await this.getCoin(id);
      console.log(newCoin);
      this.setState({ coins: [newCoin, ...coins] });
    }
  };

  removeCoin = id => {
    const { coins } = this.state;
    this.setState({ coins: coins.filter(c => c.id !== id) });
  };

  buildMeta = coin => {
    const { id, symbol, name } = coin;
    return {
      id: id,
      symbol: symbol,
      name: name,
      color: setStockColor(),
      display: true,
    };
  };

  buildQuote = coin => {
    const { market_data } = coin;
    return {
      price: market_data.current_price.usd || 0,
      change: market_data.price_change_24h || 0,
      changePercent:
        market_data.price_change_percentage_24h_in_currency.usd || 0,
    };
  };

  getCoin = async id => {
    const chart = getMarketChart(id);
    const coin = await getCoinData(id);
    const meta = this.buildMeta(coin);
    const quote = this.buildQuote(coin);
    return { ...meta, ...quote, data: await chart };
  };

  componentDidMount = async () => {
    const init = ['bitcoin', 'litecoin', 'ethereum', 'ripple'];

    const initialCoins = await Promise.all(init.map(c => this.getCoin(c)));

    this.setState({
      initLoad: true,
      coins: initialCoins,
    });

    // Update data every 10 seconds
    this.interval = setInterval(async () => {
      const { coins } = this.state;
      const updatedCoins = await Promise.all(
        coins.map(c => this.getCoin(c.id))
      );

      this.setState({ coins: updatedCoins });
    }, 10000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { coins } = this.state;

    return (
      <div className="App">
        <div className="container-graph">
          <Graph series={coins.filter(s => s.display)} />
        </div>
        <div className="container-coinlist">
          <CoinList
            coins={coins}
            addCoin={this.addCoin}
            removeCoin={this.removeCoin}
            toggleVisibility={this.toggleVisibility}
          />
        </div>
      </div>
    );
  }
}

export default App;
