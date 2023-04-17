import React, { useEffect, useRef, useState } from 'react';
import {PanelData} from '@grafana/data';
import ForceGraph3D, { ForceGraphMethods} from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import myData from '../../../logfile/logging.json';

import * as antidetector from './antipatternDetectors';


type Props = {
    data: PanelData;
    width: number;
    height: number;
}

//Text on node(Sprite Text)
function nodeObject(node : any){
    const sprite = new SpriteText(node.id);
    sprite.color = '#000000'
    sprite.textHeight = 5
    sprite.position.y = 8
    return sprite;
}

const graph: React.FC<Props> = ({data, width, height}) =>{

    const cycles = antidetector.findCycles(myData.nodes, myData.links) as any
    const [nodes, setNodes] = useState<any>([]) // nodes array
    const [links, setLinks] = useState<any>([]) //links array
    const [clickNode, setClikNode] = useState<any>(null) //set click Node state

    console.log(cycles)

    useEffect(() => {
        function add (){

            const newNodes = [] as any;
            const newLinks = [] as any;

            for(let i = 0; i < myData.nodes.length; i++){
                if(!cycles.includes(myData.nodes[i].id)){
                    newNodes.push({'id': myData.nodes[i].id, 'TraceID': myData.nodes[i].TraceID, 'StartTime': myData.nodes[i].StartTime, 'color': '#19A7CE'})
                }
                else{
                    newNodes.push({'id': myData.nodes[i].id, 'TraceID': myData.nodes[i].TraceID, 'StartTime': myData.nodes[i].StartTime, 'color': '#E90064'})
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
            //nodeColor = {() => nodes.color}
            nodeAutoColorBy = {d => nodes.color%GROUPS}
            nodeThreeObjectExtend={true}
            nodeThreeObject={(node:any) => nodeObject(node)}
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
                    <h3>{clickNode.id}</h3>
                    <p>TraceID: {clickNode.TraceID}</p>
                    <p>StartTime: {clickNode.StartTime}</p>
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