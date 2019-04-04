import React from 'react';
import Searchbar from './Searchbar';
import Coin from './Coin';

class CoinList extends React.PureComponent {
  render() {
    const { coins, addCoin, removeCoin, toggleVisibility } = this.props;
    return (
      <div className="CoinList">
        <Searchbar coins={coins} addCoin={addCoin} />
        <div className="title">Coins</div>
        {coins.map(coin => (
          <Coin
            key={coin.symbol}
            coin={coin}
            removeCoin={removeCoin}
            toggleVisibility={toggleVisibility}
          />
        ))}
      </div>
    );
  }
}

export default CoinList;
