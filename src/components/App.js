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
  if (COLORS.length === lastColorIdx + 1) {
    lastColorIdx = 0;
  } else {
    lastColorIdx++;
  }
  return color;
};

class App extends Component {
  state = {
    coins: [],
    tick: 0,
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

  addCoin = async id => {
    const { coins } = this.state;
    const coinExists = coins.some(c => c.id === id);

    if (!coinExists) {
      const newCoin = await this.getCoin(id);
      this.setState({ coins: [newCoin, ...coins] });
    }
  };

  removeCoin = id => {
    const { coins } = this.state;
    this.setState({ coins: coins.filter(c => c.id !== id) });
  };

  updateCoins = async () => {
    const { coins } = this.state;
    const updatedCharts = await Promise.all(
      coins.map(c => getMarketChart(c.id))
    );

    const updatedCoins = coins.map((coin, index) => {
      coin.data = updatedCharts[index];
      return coin;
    });
    this.setState({ coins: updatedCoins });
  };

  toggleVisibility = id => {
    const { coins } = this.state;
    this.setState({
      coins: coins.map(c => {
        if (c.id === id) c.display = !c.display;
        return c;
      }),
    });
  };

  initApp = async () => {
    const init = ['bitcoin', 'litecoin', 'ethereum', 'ripple'];
    const initialCoins = await Promise.all(init.map(c => this.getCoin(c)));
    this.setState({
      initLoad: true,
      coins: initialCoins,
    });
  };

  initUpdateTimer = () => {
    this.updateInterval = setInterval(() => {
      this.setState({ tick: this.state.tick + 1 });
      if (this.state.tick >= 10) {
        this.updateCoins();
        this.setState({ tick: 0 });
      }
    }, 1000);
  };

  componentDidMount = async () => {
    this.initApp();
    this.initUpdateTimer();
  };

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  render() {
    const { coins } = this.state;
    return (
      <div className="App">
        <div className="container-graph">
          <Graph coins={coins} />
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
