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
function nodeObject(node: any){
    const sprite = new SpriteText(node.id);
    sprite.color = '#000000'
    sprite.textHeight = 5
    sprite.position.y = 8
    return sprite;
}

function checkEle(node : any[], name: string){
    return node.some((item) => item.id === name)
}

const graph: React.FC<Props> = ({data, width, height}) =>{
    const [nodes, setNodes] = useState<any>([]) // nodes array
    const [links, setLinks] = useState<any>([]) //links array
    const [clickNode, setClikNode] = useState<any>(null) //set click Node state
    let serviceName = data.request?.targets[0].service
    
    useEffect(() => {
        function add (){
            const service = data.series.map((series) => series.fields.find((field) => field.name === 'traceName'));
            const size = service[0]?.values.length as number
            const newNodes = [] as any;
            const newLinks = [] as any;
            newNodes.push({'id':serviceName, 'name':serviceName, 'type': 'mian', 'option': 'All' })
            for(let i = 0; i < size; i++){
                let n = service[0]?.values.get(i)
                let name = n.split(':')
                if(!checkEle(newNodes, name[0])){
                    newNodes.push({'id': name[0], 'name': name[0], 'type': 'Sub', 'option': name[1]}, )
                    newLinks.push({'source': name[0], 'target': serviceName})
                }
            }
            setNodes(newNodes)
            setLinks(newLinks)
        }
        add()
    },[data])
    

    const reference = useRef<ForceGraphMethods>();

    function dispalyNode(node: any){
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
            nodeThreeObject={(node: any) => nodeObject(node)}
            onNodeClick={dispalyNode}
            />
            {clickNode && (
                <div className='node-info' style={{
                    position: 'absolute',
                    bottom: '45%',
                    left:'45%',
                    width: '350px',
                    zIndex:1000,
                    background: 'rgba(0,0,0,0.8)',
                    padding: '30px',
                    borderRadius:'5px',
                    boxShadow:'0px 0px 10px rgba(0, 0, 0, 0.4)'
                }}>
                    <h3>{clickNode.name}</h3>
                    <p>Type: {clickNode.type}</p>
                    <p>Option: {clickNode.option}</p>
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
