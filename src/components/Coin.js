import React from 'react';

class Coin extends React.Component {
  renderButtons = () => {
    const { coin } = this.props;
    const viewButtonClass =
      coin.visibility === 'on'
        ? 'coin-view-show-button coin-button'
        : 'coin-view-hidden-button coin-button';

    return (
      <div className="buttons">
        <span
          className={viewButtonClass}
          // onClick={this.handleViewClick}
        />
        <span
          className="coin-remove-button coin-button"
          // onClick={this.onRemovecoin}
        />
      </div>
    );
  };

  renderColorTab = () => {
    const { display, color } = this.props.coin;
    return display ? (
      <div className="color-tab" style={{ backgroundColor: color }} />
    ) : null;
  };

  componentDidMount() {
    const { coin, coinContainer, coinFlyIn } = this.refs;

    this.resizeEvent = () => {
      coinFlyInOffset = coinFlyIn.offsetWidth;
      coinFlyIn.style.transform =
        'translate3d(' + coinFlyInOffset + 'px, 0, 0)';
    };

    this.mouseoverEvent = () => {
      coinFlyIn.style.transform = 'translate3d(0, 0, 0)';
      coinContainer.style.transform =
        'translate3d(-' + coinFlyInOffset + 'px, 0, 0)';
    };

    this.mouseoutEvent = () => {
      coinFlyIn.style.transform =
        'translate3d(' + coinFlyInOffset + 'px, 0, 0)';
      coinContainer.style.transform = 'translate3d(0, 0, 0)';
    };

    // hide coin-fly-in div
    var coinFlyInOffset = 120;
    coinFlyIn.style.transform = 'translate3d(' + coinFlyInOffset + 'px, 0, 0)';
    coinFlyIn.style.display = 'flex';

    window.addEventListener('resize', this.resizeEvent);
    coin.addEventListener('mouseover', this.mouseoverEvent);
    coin.addEventListener('mouseout', this.mouseoutEvent);
  }

  componentWillUnmount() {
    const { coin } = this.refs;
    window.removeEventListener('resize', this.resizeEvent);
    coin.removeEventListener('mouseover', this.mouseoverEvent);
    coin.removeEventListener('mouseout', this.mouseoutEvent);
  }

  render() {
    const { symbol, color, name, price, changePercent } = this.props.coin;
    const netColor = changePercent > 0 ? '#1BCEA2' : '#FF5722';
    return (
      <div className="Coin" ref="coin">
        <div className="coin-container" ref="coinContainer">
          <div className="coin-left">
            <div className="coin-symbol">{symbol.toUpperCase()}</div>
            <div className="coin-full-name">{name}</div>
          </div>
          <div className="coin-right">
            <div className="coin-price" style={{ color: netColor }}>
              {`$${price.toFixed(2)}`}
            </div>
            <div className="coin-changePercent" style={{ color: netColor }}>
              {`${changePercent.toFixed(2)} %`}
            </div>
          </div>
        </div>
        {this.renderColorTab()}
        <div
          className="coin-fly-in"
          style={{ backgroundColor: color }}
          ref="coinFlyIn"
        >
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default Coin;
