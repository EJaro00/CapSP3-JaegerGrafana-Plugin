import React from 'react';
import { PanelProps} from '@grafana/data';
import { SimpleOptions } from 'types';
import { useTheme } from '@grafana/ui';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';

interface Props extends PanelProps<SimpleOptions> {}


export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
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
  var nodes = [{name: 'DBNode',}, 
                {name: 'tsDB'}, 
                {name: 'nacoDB'},
                {name: 'tsDB-mysql0'},
                {name: 'tsDB-mysql1'},
                {name: 'tsDB-mysql2'},
                {name: 'nacoDB-mysql0'},
                {name: 'nacoDB-mysql1'},
                {name: 'nacoDB-mysql2'},
                {name: 'ui-service'}
              ]
  function updateNodes() {
    var u = d3.select('.nodes')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(function(d) {
        return d.name
      })
      .attr('x', function(d:any) {
        return d.x
      })
      .attr('y', function(d:any) {
        return d.y
      })
      .attr('dy', function(d) {
        return 10
      })
      .attr('fill',color);
    return u
}

var links = [
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 1, target: 3},
  {source: 1, target: 4},
  {source: 1, target: 5},
  {source: 2, target: 6},
  {source: 2, target: 7},
  {source: 2, target: 8},
  {source: 0, target: 9}

]
  
function updateLinks() {
  var u = d3.select('.links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('x1', function(d:any) {
      return d.source.x
    })
    .attr('y1', function(d:any) {
      return d.source.y
    })
    .attr('x2', function(d:any) {
      return d.target.x
    })
    .attr('y2', function(d:any) {
      return d.target.y
    })
    .attr('stroke','#ccc');
  return u
}

function ticked() {
  updateLinks()
  updateNodes();
}

var simulation = d3.forceSimulation(nodes as SimulationNodeDatum[]).force('charge', d3.forceManyBody().strength(-3550))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink().links(links))

	.on('tick', ticked);
  simulation.restart
  
  return (
    <svg width={width} height={height}>
      <g className="links"></g>
      <g className="nodes"></g>
    </svg>
  );
};
