import React from 'react';
import StackedAreaChart, { StackedAreaChartProps } from './StackedAreaChart';

export type ChartType = 'stacked-area' | 'bar' | 'line' | 'pie';

export interface ChartRendererProps {
  type: ChartType;
  config: any;
  data: any[];
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  type,
  config,
  data,
}) => {
  const renderChart = () => {
    switch (type) {
      case 'stacked-area':
        return (
          <StackedAreaChart
            data={data}
            title={config.title}
            xAxisKey={config.xAxisKey}
            areas={config.areas}
            height={config.height}
            showGrid={config.showGrid}
            showLegend={config.showLegend}
            showTooltip={config.showTooltip}
          />
        );
      case 'bar':
        // Placeholder for other chart types
        return <div>Bar chart not implemented yet</div>;
      case 'line':
        // Placeholder for other chart types
        return <div>Line chart not implemented yet</div>;
      case 'pie':
        // Placeholder for other chart types
        return <div>Pie chart not implemented yet</div>;
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="chart-renderer">
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;