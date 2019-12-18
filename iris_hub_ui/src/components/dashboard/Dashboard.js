import React from 'react';

import ChartList from './ChartList'
import FailedTests from './FailedTests';
import TagsFailsChart from './TagsFailsChart';

const Dashboard = () => {
    return <div>
        <h1>Dashboard</h1>
        <ChartList /><br/>
        <TagsFailsChart/>
        <FailedTests />


    </div>
}

export default Dashboard;