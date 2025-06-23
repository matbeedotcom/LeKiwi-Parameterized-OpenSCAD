import React from 'react';
import ChartRenderer from './ChartRenderer';

// Example usage component demonstrating StackedAreaChart
export const ChartExamples: React.FC = () => {
  // Sample data for stacked area chart
  const sampleData = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 2000, expenses: 2000, profit: 0 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  ];

  // Configuration for stacked areas
  const areasConfig = [
    { 
      dataKey: 'revenue', 
      stackId: '1', 
      fill: '#8884d8', 
      name: 'Revenue' 
    },
    { 
      dataKey: 'expenses', 
      stackId: '1', 
      fill: '#82ca9d', 
      name: 'Expenses' 
    },
    { 
      dataKey: 'profit', 
      stackId: '1', 
      fill: '#ffc658', 
      name: 'Profit' 
    },
  ];

  const chartConfig = {
    title: 'Financial Performance Over Time',
    xAxisKey: 'name',
    areas: areasConfig,
    height: 400,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chart Examples</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Stacked Area Chart</h2>
        <div className="border rounded-lg p-4">
          <ChartRenderer
            type="stacked-area"
            config={chartConfig}
            data={sampleData}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Chart Configuration</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{JSON.stringify({ type: 'stacked-area', config: chartConfig, data: sampleData }, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default ChartExamples;