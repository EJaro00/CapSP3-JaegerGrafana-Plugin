import React, { useRef } from 'react';
import {PanelData} from '@grafana/data';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
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
        // get node names from datasource
       let nodeName = data.series.map((series) => series.fields.find((field) => field.name === 'node name'));
       let nodeLength: any = nodeName[0]?.values.length

        // get links from datasource
        let froms = data.series.map((series) => series.fields.find((field) => field.name === 'from'));
        let fromsLength: any = froms[0]?.values.length
        let tos = data.series.map((series) => series.fields.find((field) => field.name === 'to'));
        let tosLength: any = tos[0]?.values.length

        

        if(nodeLength > 0){
            for(let i = 0; i < nodeLength; i++){
                nodes.push({'id': i, name: nodeName[0]?.values.get(i)})
                console.log(nodes[i])
            }
        }
        if( tosLength > 0){
            for(let i = 0; i < fromsLength; i++)[
                links.push({'source': froms[0]?.values.get(i), 'target': tos[0]?.values.get(i)})
            ]
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
            nodeAutoColorBy =  {'id'}
            nodeLabel = {'id'}
            nodeOpacity = {1}
            linkDirectionalArrowLength = {4}
            linkDirectionalArrowRelPos = {1}
            nodeThreeObjectExtend = {true}
            nodeThreeObject={node => {
                const sprite = new SpriteText(node.name);
                sprite.color = node.color;
                sprite.textHeight = 6;
                sprite.position.y = -8;
                return sprite;
            }}
        />
    );
}

export default graph;