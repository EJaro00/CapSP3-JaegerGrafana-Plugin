import React from "react";
import {PanelData} from '@grafana/data';
import * as d3 from "d3"
import { SimulationNodeDatum} from 'd3';

type Props = {
    data: PanelData;
    width: number;
    height: number;
}

const graph: React.FC<Props> = ({data, width, height}) => {
  let nodes = [] as any []
  let links = [] as any []
  function add (){
    const index = data.series.map((series) => series.fields.find((field) => field.name === 'Index'));
    const name = data.series.map((series) => series.fields.find((field) => field.name === 'Name'));
    const source = data.series.map((series) => series.fields.find((field) => field.name === 'Source'));
    let array = index[0]?.values
    for(let i = 0; i < (array?.length as number) ; i++){
      let p = (array?.get(i) as number) 
      let n = name[0]?.values.get(i)
      let s = source[0]?.values.get(i)
      if(p !== null && n !== null){
        nodes.push({name: n})
        links.push({source: s, target: p})
      }
    }
  }
  

  function updateNodes() {
    d3.select('.nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', function(d: any){return d.x})
      .attr('cy', function(d: any){return d.y})
      .attr('r', 20)
      .attr('opacity', 0.5)
      .attr('fill', "#5DADE2");

    d3.select('.nodes')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(function(d) {
        return d.name
      })
      .attr('x', function(d: any) {return d.x})
      .attr('y', function(d: any) {return d.y})
      .attr('dx', function(d){return -15})
      .attr('dy', function(d) {return -15})
      .attr('fill',"#58D68D");
  }
  
  function updateLinks() {
    d3.select('.links')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const l = Math.sqrt(dx * dx + dy * dy);
        const sx = d.source.x + (dx * 20) / l;
        const sy = d.source.y + (dy * 20) / l;
        const tx = d.target.x - (dx * 20) / l;
        const ty = d.target.y - (dy * 20) / l;
        const arrowSize = 8;
        const offsetX = (dx * arrowSize) / l;
        const offsetY = (dy * arrowSize) / l;
        return `M ${sx},${sy} 
                L ${tx},${ty} 
                M ${tx - offsetX - offsetY},${ty - offsetY + offsetX} 
                L ${tx},${ty} L ${tx - offsetX + offsetY},${ty - offsetY - offsetX} Z`;
      })
      .attr('fill', "#8E44AD")

      d3.select('.links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', function(d: any) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const l = Math.sqrt(dx * dx + dy * dy);
        const sx = d.source.x + (dx * 20) / l;
        //const sy = d.source.y + (dy * 20) / l;
        return sx;
      })
      .attr('y1', function(d: any) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const l = Math.sqrt(dx * dx + dy * dy);
        //const sx = d.source.x + (dx * 20) / l;
        const sy = d.source.y + (dy * 20) / l;
        return sy;
      })
      .attr('x2', function(d: any) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const l = Math.sqrt(dx * dx + dy * dy);
        const tx = d.target.x - (dx * 20) / l;
        //const ty = d.target.y - (dy * 20) / l;
        return tx;
      })
      .attr('y2', function(d: any) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const l = Math.sqrt(dx * dx + dy * dy);
        //const tx = d.target.x - (dx * 20) / l;
        const ty = d.target.y - (dy * 20) / l;
        return ty;
      })
      .attr('stroke', '#ccc');
  }

  add()
  function ticked() {
    updateLinks();
    updateNodes();
  }
  
  d3.forceSimulation(nodes as SimulationNodeDatum[])
    .force('charge', d3.forceManyBody().strength(-1500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);
  

  return (
    <svg width={width} height={height}>
      <g className="links"></g>
      <g className="nodes"></g>
    </svg>
  );
}
export default graph;