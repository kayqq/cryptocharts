import React, { Component } from 'react';

export class Coin extends Component {
  render() {
    console.log(this.props.coin);
    return <div>{this.props.coin.name}</div>;
  }
}

export default Coin;
