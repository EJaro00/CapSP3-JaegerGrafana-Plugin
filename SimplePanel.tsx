import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import {useTheme } from '@grafana/ui';
import * as d3 from 'd3'
interface Props extends PanelProps<SimpleOptions> {}
var nodes = [{name: 'h1'},
            {name: 'h2'}]
 
export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  
  var bogoSVG = d3.select("#bogo1").append("svg").attr("width",width).attr("height",height);
  bogoSVG.append('circle').style('stroke',"gray").style("fill",theme.palette.blue80).style("opacity",0.5)
        .attr('r',130).attr('cx',150).attr('cy',150)
        .on("mouseover",function(){d3.select(this).style("fill",theme.palette.redBase)})
        .on("mouseout",function(){d3.select(this).style("fill",theme.palette.blue80)})
  
  if(options.node != null){
    let myNodeDate = options.node.split(',');
    for(let i = 0; i < myNodeDate.length; i++){
      nodes.push({name: myNodeDate[i]});
    }
  }
  
  function update(){
    d3.select('.node').selectAll('text').data(nodes).join('text').text(function(d){return d.name})
      .attr('x',function(d:any){return Math.random()*100})
      .attr('y',function(d:any){return Math.random()*100})
      .attr('dy',function(d){return 10}).style('fill',theme.palette.greenBase)
  }
  update();
  
  return (
  <svg width={width} height={height}>
    <g id='bogo1'></g>
    <g className='node'></g>
  </svg>
);
};
