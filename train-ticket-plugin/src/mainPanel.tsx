import { PanelProps} from '@grafana/data';
import { SimpleOptions } from 'types';
import graph2d from './graph/2DVersion';
import graph3d from './graph/3DVersion';

import React, { useEffect, useRef, useState } from 'react';
import myData from '../../logfile/logging.json';
import * as antidetector from './graph/antipatternDetectors';

interface Props extends PanelProps<SimpleOptions> {}
const cycles = antidetector.findCycles(myData.nodes, myData.links) as any
export const SimplePanel: React.FC<Props> = ({options, data, width, height}) => {

  const [nodes, setNodes] = useState<any>([]) // nodes array
  const [links, setLinks] = useState<any>([]) //links array

  useEffect(() => {
    function add (){

        const newNodes = [] as any;
        const newLinks = [] as any;

        for(let i = 0; i < myData.nodes.length; i++){
            if(cycles.includes(myData.nodes[i].id)){
                myData.nodes[i].color = '#E90064'
            }
        }

        for(let i = 0; i < myData.links.length; i++){
            newLinks.push({'source': myData.links[i].source, 'target': myData.links[i].target})
        }

        setNodes(newNodes)
        setLinks(newLinks)
    }
    add()
},[data])
  if(options.displayDimension === '3d'){
      return graph3d({data, width,height});
      //return(<h1>still working on it</h1>)
    }
    return graph2d({width, height});
};
