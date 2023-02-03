import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { useTheme } from '@grafana/ui';
import * as d3 from 'd3';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const values = [Math.random()*3000+1500, Math.random()*3000+1500, Math.random()*1499+1000, Math.random()*1499+1000, Math.random()*999+1, Math.random()*999+1];
  const barHeight = height / values.length;
  const scale = d3.scaleLinear().domain([0, d3.max(values) || 0.0]).range([0, width]);
  const axis = d3.axisBottom(scale);
  const padding = 20;
  const chartHeight = height - padding;
  
  let color: string;
  switch (options.color) {
    case 'red':
      color = theme.palette.redBase;
      break;
    case 'green':
      color = theme.palette.greenBase;
      break;
    case 'blue':
      color = theme.palette.blue95;
      break;
  }

  return (
    <svg width={width} height={height}>
      <g>
        {values.map((value, i) => (
          <rect x={0} y={i * barHeight} width={scale(value)} height={barHeight - 1} fill={value>=2500?theme.palette.redBase:color && value > 1100?theme.palette.blue95:color}/>
        ))}
      </g>
      <g
        transform={`translate(0, ${chartHeight})`}
          ref={(node) => {
          d3.select(node).call(axis as any);
        }}
      />
    </svg>
  ); 
};

