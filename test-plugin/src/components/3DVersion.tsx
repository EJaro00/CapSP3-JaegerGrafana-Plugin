import React, { useRef } from 'react';
import {PanelData} from '@grafana/data';
import ForceGraph3D, { ForceGraphMethods} from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';

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
            nodes.push({'id': p, 'name': n})
            if(i > 0){
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
            nodeLabel={'id'}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={3}
            linkDirectionalParticleColor={()=>'rgba(51,255,51,1)'}
            linkColor={() => 'rgba(224,224,224,1)'}
            linkWidth = {3}
            nodeColor = {() => 'rgba(0,128,255,1)'}
            nodeThreeObjectExtend={true}
            nodeThreeObject={node => {
                const sprite = new SpriteText(node.name);
                sprite.color = 'rgba(255,255,255,1)'
                sprite.textHeight = 5
                sprite.position.y = 8
                return sprite;
              }}
        />
    );
}

export default graph;