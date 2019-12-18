import React from 'react';
import { connect } from 'react-redux';
import LoadingBar from '../layout/LoadingBar';
import { Bar } from 'react-chartjs-2';
import { Card } from 'semantic-ui-react';

class TagsFailsChart extends React.Component {
    render() {
        if (this.props.failed_tests === null) {
            return <LoadingBar />
        } else {
            if (this.props.failed_tests.merged === null) {
                return <LoadingBar />
            }
            let data = {
                labels: [],
                datasets: [{
                    label: 'Tests involved',
                    backgroundColor: [],
                    data: []
                }
                ]
            }
            this.props.failed_tests.merged.map(item => {
                return item.tags.map(tag => {
                    return data.labels.push(tag.name);
                })
            })

            data.labels = [...new Set(data.labels)];
            let colors = [];
            const counts = data.labels.map(label => {
                const tg = this.props.tags.filter(color_tag => color_tag.name === label)[0];
                colors.push(tg.color);
                return this.props.failed_tests.merged.filter(item =>
                    item.tags.filter(tag => tag.name === label).length > 0
                ).length
            })
            data.datasets[0].data = counts;
            data.datasets[0].backgroundColor = colors;

            data.labels.push('Not Analyzed');
            const naCount = this.props.failed_tests.merged.filter(item => item.tags.length === 0).length;
            data.datasets[0].data.push(naCount);



            return (
                <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Results analysis status
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Bar onElementsClick={(elems) => { console.log(elems) }} height={100} legend={false} data={data} />
                    </Card.Content>
                </Card>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        failed_tests: state.dashboard.failed_tests,
        tags: state.tags.loaded_tags
    }
}

export default connect(mapStateToProps, null)(TagsFailsChart);