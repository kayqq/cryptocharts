import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { getCoins } from '../services/coingecko';
import Suggestion from './Suggestion';

class Searchbar extends Component {
  state = {
    value: '',
    suggestions: [],
    symbols: [],
  };

  componentWillMount() {
    this.fetchSuggestions();
  }
  fetchSuggestions = async () => {
    this.setState({ symbols: await getCoins() });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const inputVal = value.trim().toLowerCase();
    const inputLength = inputVal.length;
    const { symbols } = this.state;

    const suggestions =
      inputLength === 0
        ? []
        : symbols
            .filter(
              // s =>
              //   s.symbol.toLowerCase().slice(0, inputLength) === inputVal ||
              //   s.name.toLowerCase().slice(0, inputLength) === inputVal
              s => {
                // compare only against symbol if length of 4 or less
                if (inputLength < 4) {
                  return (
                    s.symbol.toLowerCase().slice(0, inputLength) === inputVal
                  );
                }
                // compare against first symbol then name
                return (
                  s.symbol.toLowerCase().slice(0, inputLength) === inputVal ||
                  s.name.toLowerCase().slice(0, inputLength) === inputVal
                );
              }
            )
            .slice(0, 5);
    this.setState({
      suggestions,
    });
  };

  getSuggestionValue = suggestion => suggestion.symbol.trim().toUpperCase();

  onSuggestionSelected = () => {
    this.setState({
      value: '',
    });
  };

  renderSuggestion = suggestion => {
    const { coins, addCoin } = this.props;

    const addedCoins = coins.map(s => s.symbol);
    const coinExists = addedCoins.some(
      s => s === suggestion.symbol.trim().toUpperCase()
    );

    return (
      <Suggestion
        coinExists={coinExists}
        suggestion={suggestion}
        addCoin={addCoin}
      />
    );
  };

  renderInputComponent = inputProps => {
    return (
      <div className="input-container">
        <span className="search-icon" />
        <input {...inputProps} />
      </div>
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Search by symbol or name',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.onSuggestionSelected}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        inputProps={inputProps}
      />
    );
  }
}

export default Searchbar;
