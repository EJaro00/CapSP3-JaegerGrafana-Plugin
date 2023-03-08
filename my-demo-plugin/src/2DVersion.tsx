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
  let nodes: {name: string}[] = []
  let links: {source: number, target: number}[] = []
  // get node names from datasource
  let nodeName = data.series.map((series) => series.fields.find((field) => field.name === 'node name'));
  let nodeLength: any = nodeName[0]?.values.length

  // get links from datasource
  let froms = data.series.map((series) => series.fields.find((field) => field.name === 'from'));
  let fromsLength: any = froms[0]?.values.length
  let tos = data.series.map((series) => series.fields.find((field) => field.name === 'to'));
  let tosLength: any = tos[0]?.values.length

  function add (){
    if(nodeLength > 0){
      for(let i = 0; i < nodeLength; i++){
        let tempNode: {name: string} = {
          name: nodeName[0]?.values.get(i)
        }
        nodes.push(tempNode)
      }
    }
    if( tosLength > 0){
      for(let i = 0; i < fromsLength; i++){
        let tempLink: {source: number, target: number} = {
          source: +froms[0]?.values.get(i),
          target: +tos[0]?.values.get(i)
        }
        links.push(tempLink)
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
    .force('charge', d3.forceManyBody().strength(-1000))
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