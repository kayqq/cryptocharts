import React, { PureComponent } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import '../scss/_graph.scss';

export class Graph extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      chartOptions: {
        rangeSelector: {
          selected: 3,
          enabled: false,
        },
        scrollbar: {
          height: 4,
          liveRedraw: true,
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
      },
    };
  }

  render() {
    const options = {
      ...this.state.chartOptions,
      series: this.props.coins.filter(c => c.display),
    };

    return (
      <div id="Graph">
        <HighchartsReact
          containerProps={{ className: 'Graph' }}
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={options}
          allowChartUpdate={true}
          updateArgs={[true, true, true]}
        />
      </div>
    );
  }
}

export default Graph;
