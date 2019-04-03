import React from 'react';
import Highcharts from 'highcharts/highstock';
import '../scss/_graph.scss';

class Graph extends React.Component {
  createChart() {
    const { series } = this.props;

    this.config = {
      rangeSelector: {
        selected: 3,
        enabled: false,
      },
      scrollbar: {
        height: 4,
      },
      tooltip: {
        style: {
          color: '#9AA5BC',
          cursor: 'default',
          fontSize: '12px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        },
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}</b><br/>',
        valueDecimals: 2,
        // shared: true
        // split: true
      },
      xAxis: {
        labels: {
          style: {
            color: '#9AA5BC',
            fontFamily: "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;",
          },
        },
      },
      yAxis: {
        labels: {
          format: '$ {value}',
          style: {
            color: '#9AA5BC',
            fontFamily: "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;",
          },
        },
      },
    };

    this.chart = Highcharts.stockChart('Graph', {
      ...this.config,
      series,
    });
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  render() {
    return <div id="Graph" />;
  }
}

export default Graph;
