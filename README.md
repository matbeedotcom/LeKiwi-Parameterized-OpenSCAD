# Urbis AI - Chart Rendering System

This project implements a comprehensive chart rendering system with support for StackedAreaChart using Recharts library, integrated with AI-powered chat tools.

## Features

- **StackedAreaChart Component**: A flexible, configurable stacked area chart built with Recharts
- **ChartRenderer System**: Modular chart rendering that supports multiple chart types
- **AI Tool Integration**: StackedAreaChart as a supported tool in the chat system
- **TypeScript Support**: Fully typed implementation for better development experience

## Project Structure

```
├── src/
│   ├── app/
│   │   └── assistant/
│   │       └── useChatStream.ts          # Chat stream hook with tool definitions
│   └── components/
│       └── charts/
│           ├── StackedAreaChart.tsx      # Stacked area chart component
│           ├── ChartRenderer.tsx         # Main chart renderer
│           └── ChartExamples.tsx         # Usage examples
├── chatbot/
│   └── routes.ts                         # Backend routes with tool handlers
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
└── README.md                            # This file
```

## Installation

```bash
npm install
```

### Key Dependencies

- `recharts`: ^2.8.0 - Chart library
- `react`: ^18.2.0 - React framework
- `typescript`: ^5.0.0 - TypeScript support

## Usage

### 1. Direct Component Usage

```tsx
import React from 'react';
import StackedAreaChart from './src/components/charts/StackedAreaChart';

const data = [
  { name: 'Jan', series1: 4000, series2: 2400, series3: 2400 },
  { name: 'Feb', series1: 3000, series2: 1398, series3: 2210 },
  // ... more data
];

const areas = [
  { dataKey: 'series1', stackId: '1', fill: '#8884d8', name: 'Series 1' },
  { dataKey: 'series2', stackId: '1', fill: '#82ca9d', name: 'Series 2' },
  { dataKey: 'series3', stackId: '1', fill: '#ffc658', name: 'Series 3' },
];

function MyChart() {
  return (
    <StackedAreaChart
      data={data}
      areas={areas}
      title="My Stacked Area Chart"
      height={400}
    />
  );
}
```

### 2. Chart Renderer System

```tsx
import ChartRenderer from './src/components/charts/ChartRenderer';

function MyPage() {
  const chartConfig = {
    title: 'Financial Performance',
    xAxisKey: 'name',
    areas: [
      { dataKey: 'revenue', stackId: '1', fill: '#8884d8', name: 'Revenue' },
      { dataKey: 'expenses', stackId: '1', fill: '#82ca9d', name: 'Expenses' },
    ],
    height: 400,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  };

  return (
    <ChartRenderer
      type="stacked-area"
      config={chartConfig}
      data={data}
    />
  );
}
```

### 3. AI Tool Integration

The StackedAreaChart is integrated as a tool in the chat system:

#### Frontend (useChatStream)

```tsx
import { useChatStream } from './src/app/assistant/useChatStream';

function ChatInterface() {
  const { sendMessage, messages, availableTools } = useChatStream();

  // The hook includes 'create_stacked_area_chart' tool automatically
  console.log(availableTools); // Shows available chart tools
}
```

#### Backend (routes.ts)

```typescript
import { handleChatRequest } from './chatbot/routes';

// The tool is automatically available in chat requests
// Example tool call response:
{
  "id": "chart-1234567890",
  "name": "create_stacked_area_chart",
  "parameters": {
    "type": "stacked-area",
    "config": {
      "title": "Sample Chart",
      "areas": [...],
      "data": [...]
    }
  }
}
```

## StackedAreaChart Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `StackedAreaChartData[]` | ✅ | - | Array of data points |
| `areas` | `AreaConfig[]` | ✅ | - | Configuration for each area |
| `title` | `string` | ❌ | - | Chart title |
| `xAxisKey` | `string` | ❌ | `'name'` | Key for X-axis data |
| `height` | `number` | ❌ | `400` | Chart height in pixels |
| `showGrid` | `boolean` | ❌ | `true` | Show grid lines |
| `showLegend` | `boolean` | ❌ | `true` | Show legend |
| `showTooltip` | `boolean` | ❌ | `true` | Show tooltip on hover |

### Area Configuration

Each area in the `areas` array should have:

```typescript
{
  dataKey: string;    // Key in data object for this area
  stackId: string;    // Stack identifier for grouping areas
  fill: string;       // Color for this area (hex code)
  name?: string;      // Display name for this area
}
```

## Tool Definition

The StackedAreaChart tool is defined in both frontend and backend with the following schema:

```json
{
  "name": "create_stacked_area_chart",
  "description": "Create a stacked area chart visualization with multiple data series",
  "parameters": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "data": { 
        "type": "array",
        "items": { "type": "object" }
      },
      "areas": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "dataKey": { "type": "string" },
            "stackId": { "type": "string" },
            "fill": { "type": "string" },
            "name": { "type": "string" }
          },
          "required": ["dataKey", "stackId", "fill"]
        }
      },
      "xAxisKey": { "type": "string", "default": "name" },
      "height": { "type": "number", "default": 400 },
      "showGrid": { "type": "boolean", "default": true },
      "showLegend": { "type": "boolean", "default": true },
      "showTooltip": { "type": "boolean", "default": true }
    },
    "required": ["data", "areas"]
  }
}
```

## Example Chat Interaction

**User**: "Create a stacked area chart showing revenue, expenses, and profit over the last 6 months"

**Assistant**: "I've created a stacked area chart for you."

**Tool Call**: 
```json
{
  "id": "chart-1708123456789",
  "name": "create_stacked_area_chart",
  "parameters": {
    "type": "stacked-area",
    "config": {
      "title": "Financial Performance Over 6 Months",
      "areas": [
        { "dataKey": "revenue", "stackId": "1", "fill": "#8884d8", "name": "Revenue" },
        { "dataKey": "expenses", "stackId": "1", "fill": "#82ca9d", "name": "Expenses" },
        { "dataKey": "profit", "stackId": "1", "fill": "#ffc658", "name": "Profit" }
      ]
    },
    "data": [
      { "name": "Jan", "revenue": 4000, "expenses": 2400, "profit": 1600 },
      // ... more months
    ]
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Extending the System

To add more chart types:

1. Create a new chart component (e.g., `BarChart.tsx`)
2. Add the chart type to `ChartRenderer.tsx`
3. Add tool definition to `useChatStream.ts` and `routes.ts`
4. Implement the tool handler in `routes.ts`

## API Endpoints

- `POST /api/chat` - Main chat endpoint that processes messages and tool calls
- `POST /api/tools/execute` - Direct tool execution endpoint

## License

This project is part of the Urbis AI system.