import { Request, Response } from 'express';

export interface StackedAreaChartParams {
  title?: string;
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  areas: Array<{
    dataKey: string;
    stackId: string;
    fill: string;
    name?: string;
  }>;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: any;
}

export interface ChatRequest {
  message: string;
  tools?: any[];
  conversation_id?: string;
}

export interface ChatResponse {
  content: string;
  toolCalls?: ToolCall[];
  conversation_id: string;
}

// Tool handler for creating stacked area charts
export const handleCreateStackedAreaChart = (params: StackedAreaChartParams): ToolCall => {
  // Validate required parameters
  if (!params.data || !Array.isArray(params.data)) {
    throw new Error('Data array is required for stacked area chart');
  }
  
  if (!params.areas || !Array.isArray(params.areas)) {
    throw new Error('Areas configuration is required for stacked area chart');
  }

  // Validate areas configuration
  for (const area of params.areas) {
    if (!area.dataKey || !area.stackId || !area.fill) {
      throw new Error('Each area must have dataKey, stackId, and fill properties');
    }
  }

  return {
    id: `chart-${Date.now()}`,
    name: 'create_stacked_area_chart',
    parameters: {
      type: 'stacked-area',
      config: {
        title: params.title,
        xAxisKey: params.xAxisKey || 'name',
        areas: params.areas,
        height: params.height || 400,
        showGrid: params.showGrid !== false,
        showLegend: params.showLegend !== false,
        showTooltip: params.showTooltip !== false,
      },
      data: params.data,
    },
  };
};

// Available tools configuration
export const TOOLS = [
  {
    name: 'create_stacked_area_chart',
    description: 'Create a stacked area chart visualization with multiple data series',
    handler: handleCreateStackedAreaChart,
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the chart',
        },
        data: {
          type: 'array',
          description: 'Array of data points for the chart',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
        areas: {
          type: 'array',
          description: 'Configuration for each area in the stack',
          items: {
            type: 'object',
            properties: {
              dataKey: {
                type: 'string',
                description: 'Key in data object for this area',
              },
              stackId: {
                type: 'string',
                description: 'Stack identifier for grouping areas',
              },
              fill: {
                type: 'string',
                description: 'Color for this area (hex code)',
              },
              name: {
                type: 'string',
                description: 'Display name for this area',
              },
            },
            required: ['dataKey', 'stackId', 'fill'],
          },
        },
        xAxisKey: {
          type: 'string',
          description: 'Key for X-axis data (default: "name")',
          default: 'name',
        },
        height: {
          type: 'number',
          description: 'Height of the chart in pixels',
          default: 400,
        },
        showGrid: {
          type: 'boolean',
          description: 'Whether to show grid lines',
          default: true,
        },
        showLegend: {
          type: 'boolean',
          description: 'Whether to show legend',
          default: true,
        },
        showTooltip: {
          type: 'boolean',
          description: 'Whether to show tooltip on hover',
          default: true,
        },
      },
      required: ['data', 'areas'],
    },
  },
];

// Main chat endpoint
export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, tools, conversation_id } = req.body as ChatRequest;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Process the message and determine if any tools should be called
    const toolCalls: ToolCall[] = [];
    
    // Simple tool detection based on message content
    // In a real implementation, this would use an LLM to determine tool usage
    if (message.toLowerCase().includes('stacked area chart') || 
        message.toLowerCase().includes('area chart')) {
      
      // This is a simplified example - in practice, the LLM would extract parameters
      const exampleData = [
        { name: 'Jan', series1: 4000, series2: 2400, series3: 2400 },
        { name: 'Feb', series1: 3000, series2: 1398, series3: 2210 },
        { name: 'Mar', series1: 2000, series2: 9800, series3: 2290 },
        { name: 'Apr', series1: 2780, series2: 3908, series3: 2000 },
        { name: 'May', series1: 1890, series2: 4800, series3: 2181 },
        { name: 'Jun', series1: 2390, series2: 3800, series3: 2500 },
      ];

      const exampleAreas = [
        { dataKey: 'series1', stackId: '1', fill: '#8884d8', name: 'Series 1' },
        { dataKey: 'series2', stackId: '1', fill: '#82ca9d', name: 'Series 2' },
        { dataKey: 'series3', stackId: '1', fill: '#ffc658', name: 'Series 3' },
      ];

      const chartTool = handleCreateStackedAreaChart({
        title: 'Sample Stacked Area Chart',
        data: exampleData,
        areas: exampleAreas,
      });

      toolCalls.push(chartTool);
    }

    const response: ChatResponse = {
      content: toolCalls.length > 0 
        ? 'I\'ve created a stacked area chart for you.' 
        : 'I understand you want to create charts. Please specify what type of data you\'d like to visualize.',
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      conversation_id: conversation_id || `conv-${Date.now()}`,
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Tool execution endpoint
export const handleToolExecution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolName, parameters } = req.body;

    const tool = TOOLS.find(t => t.name === toolName);
    if (!tool) {
      res.status(404).json({ error: `Tool ${toolName} not found` });
      return;
    }

    const result = tool.handler(parameters);
    res.json(result);
  } catch (error) {
    console.error('Error executing tool:', error);
    res.status(500).json({ 
      error: 'Tool execution failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export all available tools for external use
export const getAvailableTools = () => {
  return TOOLS.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
};