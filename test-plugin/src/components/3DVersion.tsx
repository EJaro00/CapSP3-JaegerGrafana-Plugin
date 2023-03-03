import React, { useRef } from 'react';
import {PanelData} from '@grafana/data';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';

type Props = {
    data: PanelData;
    width: number;
    height: number;
}

const graph: React.FC<Props> = ({data, width, height}) =>{
    const nodes = [] as any
    const links = [] as any
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
            if(p !== n){
                nodes.push({'id': p, name: n})
                links.push({'source': s, 'target': p})
            }
          }
        }
    }

    add()

    const reference = useRef<ForceGraphMethods>();
    return (
        <ForceGraph3D
            ref={reference}
            graphData={{nodes,links}}
            width={width}
            height={height}
            linkDirectionalArrowColor={() => 'rgba(0,255,255,1)'}
            linkColor={() => 'rgba(0,255,255,1)'}
            linkWidth = {3}
            nodeColor = {() => 'rgba(0,204,102,1)'}
            nodeLabel = {nodes.name}
        />
    );
}

export default graph;