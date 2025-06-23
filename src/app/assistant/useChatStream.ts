import { useState, useCallback } from 'react';

export interface StackedAreaChartTool {
  name: 'create_stacked_area_chart';
  description: 'Create a stacked area chart visualization with multiple data series';
  parameters: {
    type: 'object';
    properties: {
      title: {
        type: 'string';
        description: 'Title of the chart';
      };
      data: {
        type: 'array';
        description: 'Array of data points for the chart';
        items: {
          type: 'object';
          additionalProperties: true;
        };
      };
      areas: {
        type: 'array';
        description: 'Configuration for each area in the stack';
        items: {
          type: 'object';
          properties: {
            dataKey: {
              type: 'string';
              description: 'Key in data object for this area';
            };
            stackId: {
              type: 'string';
              description: 'Stack identifier for grouping areas';
            };
            fill: {
              type: 'string';
              description: 'Color for this area (hex code)';
            };
            name: {
              type: 'string';
              description: 'Display name for this area';
            };
          };
          required: ['dataKey', 'stackId', 'fill'];
        };
      };
      xAxisKey: {
        type: 'string';
        description: 'Key for X-axis data (default: "name")';
        default: 'name';
      };
      height: {
        type: 'number';
        description: 'Height of the chart in pixels';
        default: 400;
      };
      showGrid: {
        type: 'boolean';
        description: 'Whether to show grid lines';
        default: true;
      };
      showLegend: {
        type: 'boolean';
        description: 'Whether to show legend';
        default: true;
      };
      showTooltip: {
        type: 'boolean';
        description: 'Whether to show tooltip on hover';
        default: true;
      };
    };
    required: ['data', 'areas'];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: any[];
}

export interface UseChatStreamOptions {
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export const AVAILABLE_TOOLS = [
  {
    name: 'create_stacked_area_chart',
    description: 'Create a stacked area chart visualization with multiple data series',
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
] as const;

export const useChatStream = (options: UseChatStreamOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate API call to chat service
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          tools: AVAILABLE_TOOLS,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        toolCalls: data.toolCalls,
      };

      setMessages(prev => [...prev, assistantMessage]);
      options.onMessage?.(assistantMessage);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    availableTools: AVAILABLE_TOOLS,
  };
};