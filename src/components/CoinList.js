import React from 'react';
import Searchbar from './Searchbar';
import Coin from './Coin';

export default ({ coins, addCoin, removeCoin, toggleVisibility }) => (
  <div className="CoinList">
    <Searchbar coins={[]} addCoin={addCoin} />
    <div className="title">My Coins</div>
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
