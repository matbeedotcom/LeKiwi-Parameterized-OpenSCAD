import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface StackedAreaChartData {
  name: string;
  [key: string]: string | number;
}

export interface StackedAreaChartProps {
  data: StackedAreaChartData[];
  width?: number;
  height?: number;
  title?: string;
  xAxisKey?: string;
  areas: Array<{
    dataKey: string;
    stackId: string;
    fill: string;
    name?: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  data,
  width = 800,
  height = 400,
  title,
  xAxisKey = 'name',
  areas,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stackId={area.stackId}
              stroke={area.fill}
              fill={area.fill}
              name={area.name || area.dataKey}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;