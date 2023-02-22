import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { useTheme } from '@grafana/ui';
import * as d3 from "d3"
import { SimulationNodeDatum} from 'd3';

interface Props extends PanelProps<SimpleOptions> {}

let nodes = [{name: 'DBNode'},{name: 'tsDB'},{name: 'nacoDB'}]
let links = [{source: 0, target: 1},{source: 0, target: 2}]


export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  
  function add (){
    if(options.node !== ''){
      if(options.node){
        let myNodeDate = options.node.split(';');
        for(let i = 0; i < myNodeDate.length; i++){
          let n = {name: myNodeDate[i].split(',')[0]};
          let l = {source: +myNodeDate[i].split(',')[1], target: +myNodeDate[i].split(',')[2]}
          if(checkDuplicateName(n,l) === true){
            nodes.push(n);
            links.push(l);
          }
        }
      }
    }

    if(options.link !== ''){
      if(options.link){
        let linkDate = options.link.split(';');
        for(let i = 0; i < linkDate.length; i++){
          let l2 = {source: +linkDate[i].split(',')[0], target: +linkDate[i].split(',')[1]}
          if(checkDuplicateLink(l2) === true){
            links.push(l2);
          }
        }
      }
    }
  }

  function updateNodes() {
    d3.select('.nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', function(d:any){return d.x})
      .attr('cy', function(d:any){return d.y})
      .attr('r', 20)
      .attr('opacity', 0.5)
      .attr('fill', theme.palette.blue80);

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
      .attr('fill',theme.palette.greenBase);
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
      .attr('fill', theme.palette.white)

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
  
  let simulate = d3.forceSimulation(nodes as SimulationNodeDatum[])
    .force('charge', d3.forceManyBody().strength(-1500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);
  simulate.stop

  return (
    <svg width={width} height={height}>
      <g className="links"></g>
      <g className="nodes"></g>
    </svg>
  );
};

function checkDuplicateLink(linked: {source: number, target: number}): boolean{
  for(let j = 0; j < links.length; j++){
    let s = links[j].source as any;
    let t = links[j].target as any;
    if(s.index === linked.source && t.index === linked.target){
      return false
    }
  }
  return true
}

function checkDuplicateName(nameString: { name: string; }, 
  linked: {source: number, target: number}): boolean{

  for(let i = 0; i < nodes.length; i++){
    if(nodes[i].name === nameString.name){
      return false
    }
  }
  for(let j = 0; j < links.length; j++){
    let s = links[j].source as any;
    let t = links[j].target as any;
    if(s.index === linked.source && t.index === linked.target){
      return false
    }
  }
  return true
}