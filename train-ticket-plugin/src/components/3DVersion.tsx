import React, { useEffect, useRef, useState } from 'react';
import {PanelData} from '@grafana/data';
import ForceGraph3D, { ForceGraphMethods} from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';

type Props = {
    data: PanelData;
    width: number;
    height: number;
}

//Text on node(Sprite Text)
function nodeObject(node : any){
    const sprite = new SpriteText(node.name);
    sprite.color = '#000000'
    sprite.textHeight = 5
    sprite.position.y = 8
    return sprite;
}

const graph: React.FC<Props> = ({data, width, height}) =>{
    const [nodes, setNodes] = useState<any>([]); //nodes array
    const [links, setLinks] = useState<any>([]); //links array
    const [clickNode, setClikNode] = useState<any>(null) //set click Node state
    
   

    useEffect(() => {
        function add (){
            const index = data.series.map((series) => series.fields.find((field) => field.name === 'Index'));
            const name = data.series.map((series) => series.fields.find((field) => field.name === 'Name'));
            const source = data.series.map((series) => series.fields.find((field) => field.name === 'Source'));
            let array = index[0]?.values
            const newNodes = [] as any;
            const newLinks = [] as any;
            for(let i = 0; i < (array?.length as number) ; i++){
              let p = (array?.get(i) as number) 
              let n = name[0]?.values.get(i)
              let s = source[0]?.values.get(i)
              if(p !== null && n !== null){
                newNodes.push({'id': p, 'name': n})
                if(i > 0){
                    newLinks.push({'source': s, 'target': p})
                }
              }
            }
            setNodes(newNodes)
            setLinks(newLinks)
        }
        add()
    },[data])
    

    const reference = useRef<ForceGraphMethods>();

    function dispalyNode(node:any){
        setClikNode(node);
    }
    return (
        <>
            <ForceGraph3D
            ref={reference}
            graphData={{nodes,links}}
            backgroundColor = "#BDC3C7"
            width={width}
            height={height}
            nodeLabel={'id'}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={3}
            linkDirectionalParticleColor={()=>'#b0f70e'}
            linkColor={() => '#146C94'}
            linkWidth = {3}
            nodeColor = {() => '#19A7CE'}
            nodeThreeObjectExtend={true}
            nodeThreeObject={(node:any) => nodeObject(node)}
            onNodeClick={dispalyNode}
            />
            {clickNode && (
                <div className='node-info' style={{
                    position: 'absolute',
                    bottom: '45%',
                    left:'45%',
                    width: '200px',
                    zIndex:1000,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '30px',
                    borderRadius:'5px',
                    boxShadow:'0px 0px 10px rgba(0, 0, 0, 0.4)'
                }}>
                    <h3>{clickNode.name}</h3>
                    <p>ID: {clickNode.id}</p>
                    <button style={{
                        position:'absolute',
                        bottom:'5%',
                        left:'35%',
                        backgroundColor:'#EA4C89',
                        borderRadius:'8px',
                        borderStyle:'none',
                        boxSizing:'border-box',
                        color:'#FFFFFF',
                    }}
                    onClick={() => setClikNode(null)}>Close</button>
                </div>
            )}
        </>
    );
}

export default graph;
