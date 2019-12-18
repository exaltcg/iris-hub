import React from 'react';
import ChartItem from './ChartItem';

class ChartList extends React.Component {
    state = { charts: ['osx', 'linux', 'win', 'win7'] }

    renderCharts() {
        return (

            <div className="ui stackable grid">
                {this.state.charts.map(item => {
                    return <ChartItem key={item} platform={item} />

                })}
            </div>



        );
    }


    render() {
        return (
            this.renderCharts()
        );
    }
}


export default ChartList;