import React from 'react';

class Suggestion extends React.Component {
  handleClick = () => {
    const { addCoin, suggestion } = this.props;
    addCoin(suggestion.id);
  };

  renderButton = () => {
    if (this.props.coinExists) {
      return <span onClick={this.handleClick} className="coin-added-button" />;
    } else {
      return <span onClick={this.handleClick} className="add-coin-button" />;
    }
  };

  render() {
    const { symbol, name } = this.props.suggestion;
    return (
      <div className="suggestion" onClick={this.handleClick}>
        <div className="suggestion-left">
          <div className="suggestion-symbol">{symbol.toUpperCase()}</div>
          <div className="suggestion-full-name">{name}</div>
        </div>
        <div className="suggestion-right">{this.renderButton()}</div>
      </div>
    );
  }
}

export default Suggestion;
