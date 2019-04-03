import React from 'react';

class Coin extends React.Component {
  // Drag & Drop
  dragStartX = 0;
  left = 0;
  dragged = false;
  isOffset = false;
  deleteThreshold = 0.9;

  // FPS Limit
  startTime;
  fpsInterval = 1000 / 60;

  onRemoveCoin = () => {
    const { removeCoin, coin } = this.props;
    removeCoin(coin.id);
  };

  onToggleVisibility = () => {
    const { toggleVisibility, coin } = this.props;
    toggleVisibility(coin.id);
  };

  renderButtons = () => {
    const { coin } = this.props;
    const viewButtonClass =
      coin.visibility === 'on'
        ? 'coin-view-show-button coin-button'
        : 'coin-view-hidden-button coin-button';

    return (
      <div className="buttons">
        <span className={viewButtonClass} onClick={this.onToggleVisibility}>
          View
        </span>
        <span
          className="coin-remove-button coin-button"
          onClick={this.onRemoveCoin}
        >
          X
        </span>
      </div>
    );
  };

  renderColorTab = () => {
    const { display, color } = this.props.coin;
    return display ? (
      <div
        className="color-tab"
        ref="colorTab"
        style={{ backgroundColor: color }}
      />
    ) : null;
  };

  // DragStart
  onDragStartMouse = evt => {
    this.onDragStart(evt.clientX);
    window.addEventListener('mousemove', this.onMouseMove);
  };

  onDragStartTouch = evt => {
    const touch = evt.targetTouches[0];
    this.onDragStart(touch.clientX);
    window.addEventListener('touchmove', this.onTouchMove);
  };

  onDragStart = clientX => {
    this.dragged = true;
    this.dragStartX = clientX;
    this.startTime = Date.now();
    requestAnimationFrame(this.updatePosition);
  };

  // DragEnd
  onDragEndMouse = evt => {
    window.removeEventListener('mousemove', this.onMouseMove);
    this.onDragEnd();
  };

  onDragEndTouch = evt => {
    window.removeEventListener('touchmove', this.onTouchMove);
    this.onDragEnd();
  };

  onDragEnd = () => {
    const { coin, coinContainer, coinFlyIn } = this.refs;
    // repeated code, dry this
    const mouseoverOffset = this.isOffset ? coin.offsetWidth * 0.33 : 0;
    const currentLeft = this.left - mouseoverOffset;

    if (this.dragged) {
      this.dragged = false;
      if (currentLeft <= coin.offsetWidth * this.deleteThreshold * -1) {
        coin.style.transition = 'transform 0.5s ease-out';
        console.log(coin.offsetHeight);
        this.left = -coin.offsetWidth * 2;

        this.onSwiped();
      } else {
        this.left = 0;
      }
      coin.style.transform = `translateX(${this.left}px)`;
    }
  };

  // Move
  onMouseMove = evt => {
    this.left = evt.clientX - this.dragStartX;
  };

  onTouchMove = evt => {
    const touch = evt.targetTouches[0];
    this.left = touch.clientX - this.dragStartX;
  };

  updatePosition = () => {
    const { coin, coinFlyIn, coinContainer, colorTab } = this.refs;

    if (this.dragged) requestAnimationFrame(this.updatePosition);

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (this.dragged && elapsed > this.fpsInterval) {
      // repeated code, dry this
      const mouseoverOffset = this.isOffset ? coin.offsetWidth * 0.33 : 0;
      const currentLeft = this.left - mouseoverOffset;
      console.log(currentLeft);

      if (currentLeft < 0 && currentLeft >= -coin.offsetWidth) {
        // UPDATE DIV POSITION IF WITHIN BOUNDS
        coin.style.transform = `translateX(${this.left}px)`;
      }
      if (currentLeft <= coin.offsetWidth * 0.9 * -1) {
        colorTab.style.backgroundColor = 'grey';
        coinFlyIn.style.backgroundColor = 'grey';
      } else {
        colorTab.style.backgroundColor = this.props.coin.color;
        coinFlyIn.style.backgroundColor = this.props.coin.color;
      }
      this.startTime = Date.now();
    }
  };

  onClicked = () => {
    console.log('deleted');
  };

  onSwiped = () => {
    const { coin, removeCoin } = this.props;
    removeCoin(coin.id);
    console.log('deleting');
  };

  componentDidMount() {
    const { coin, coinContainer, coinFlyIn } = this.refs;

    // hide coin-fly-in div
    var coinFlyInOffset = coinContainer.offsetWidth;
    coinFlyIn.style.transform = `translate3d(${coinFlyInOffset}px, 0, 0)`;
    coinFlyIn.style.display = 'flex';

    this.resizeEvent = () => {
      coinFlyInOffset = coinFlyIn.offsetWidth;
      coinFlyIn.style.transform = `translate3d(${coinFlyInOffset}px, 0, 0)`;
    };

    // Shift left
    this.mouseoverEvent = () => {
      coinFlyIn.style.transform = `translate3d(${coinFlyInOffset *
        0.66}px, 0, 0)`;
      coinContainer.style.transform = `translate3d(${-coinFlyInOffset *
        0.33}px, 0, 0)`;
      this.isOffset = true;
    };

    // Shift right
    this.mouseoutEvent = () => {
      coinFlyIn.style.transform = `translate3d(${coinFlyInOffset}px, 0, 0)`;
      coinContainer.style.transform = `translate3d(0, 0, 0)`;
      this.isOffset = false;
    };

    window.addEventListener('resize', this.resizeEvent);
    coin.addEventListener('mouseover', this.mouseoverEvent);
    coin.addEventListener('mouseout', this.mouseoutEvent);

    // SWIPING
    window.addEventListener('mouseup', this.onDragEndMouse);
    window.addEventListener('touchend', this.onDragEndTouch);
  }

  componentWillUnmount() {
    const { coin } = this.refs;
    window.removeEventListener('resize', this.resizeEvent);
    coin.removeEventListener('mouseover', this.mouseoverEvent);
    coin.removeEventListener('mouseout', this.mouseoutEvent);

    // SWIPING
    window.removeEventListener('mouseup', this.onDragEndMouse);
    window.removeEventListener('touchend', this.onDragEndTouch);
  }

  render() {
    const { symbol, color, name, price, changePercent } = this.props.coin;
    const netColor = changePercent > 0 ? '#1BCEA2' : '#FF5722';
    return (
      <div
        className="Coin"
        ref="coin"
        onMouseDown={this.onDragStartMouse}
        onTouchStart={this.onDragStartTouch}
      >
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
