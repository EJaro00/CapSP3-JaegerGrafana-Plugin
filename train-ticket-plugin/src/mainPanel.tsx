import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import graph2d from './graph/2DVersion';
import graph3d from './graph/3DVersion';

import React, { useEffect, useRef, useState } from 'react';
import * as antidetector from './graph/antipatternDetectors';
import { ForceGraphMethods } from 'react-force-graph-2d';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({options, data, width, height}) => {
  const reference = useRef<ForceGraphMethods>();


  const [myData, setMyData] = useState<any>(null);
  const [nodes, setNodes] = useState<any>([]);
  const [links, setLinks] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/logging');
        const jsonData = await response.json();
        setMyData(jsonData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [data]);

  useEffect(() => {
    function add() {
      if (!myData) {
        return;
      }

      let antiPattern = antidetector.findBottlenecks(myData.nodes, myData.links, options.threshold) as any
      if(options.algorithm === 'nanoservices'){
        antiPattern = antidetector.findNanoservices(myData.nodes, myData.links, options.threshold) as any
      }


      const cycles = antidetector.findCycles(myData.nodes, myData.links) as any;
      const newNodes = [] as any;
      const newLinks = [] as any;

      for (let i = 0; i < myData.nodes.length; i++) {
        if (cycles.includes(myData.nodes[i].id)) {
          myData.nodes[i].color = '#E90064';
        }
        if(antiPattern.has(myData.nodes[i].id)){
          myData.nodes[i].textcolor = "Purple"
        }
        newNodes.push(myData.nodes[i]);
      }

      for (let i = 0; i < myData.links.length; i++) {
        newLinks.push(myData.links[i]);
      }

      setNodes(newNodes);
      setLinks(newLinks);
    }

    add();
  }, [myData]);

  if (options.displayDimension === '3d') {
    return graph3d({ myData: { nodes, links }, width, height, reference});
  }

  return graph2d({ myData: { nodes, links }, width, height, reference });
};
