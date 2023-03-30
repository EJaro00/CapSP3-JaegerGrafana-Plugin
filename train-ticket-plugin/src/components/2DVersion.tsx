import React, { useEffect, useRef, useState } from "react";
import {PanelData} from '@grafana/data';
import ForceGraph2d, { ForceGraphMethods } from "react-force-graph-2d";

type Props = {
    data: PanelData;
    width: number;
    height: number;
}

//Text on node(Sprite Text)
function textOnNode(node: any, ctx: any, globalScale: any){
    const label = node.name;
    const fontSize = 12 / globalScale;
    const nodeSize = 15 / globalScale;
    const x = node.x;
    const y = node.y;
    //draw Cycle
    ctx.beginPath();
    ctx.arc(x, y, nodeSize+3, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(22,136,163,0.5)";
    ctx.fill();
    //write text
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
}

//
function linkfix(link: any, ctx: any, scale: any){
    const { source, target } = link;
      const nodeSize = 15 / scale;

      // calculate length and angle
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const angle = Math.atan2(dy, dx);

      //computing coordinate
      const sx = source.x + (nodeSize + 5) * Math.cos(angle);
      const sy = source.y + (nodeSize + 5) * Math.sin(angle);
      const tx = target.x - (nodeSize + 5) * Math.cos(angle);
      const ty = target.y - (nodeSize + 5) * Math.sin(angle);

      //draw line
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = "#146C94";
      ctx.lineWidth = 1;
      ctx.stroke();

}
const graph: React.FC<Props> = ({data, width, height}) => {
  const [nodes, setNodes] = useState<any>([]) // nodes array
  const [links, setLinks] = useState<any>([]) //links array
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

function dispalyNode(node:any){
    setClikNode(node);
}

const reference = useRef<ForceGraphMethods>();
return(
    <>
        <ForceGraph2d 
        ref={reference}
        graphData={{nodes,links}}
        backgroundColor = "#BDC3C7"
        width={width}
        height={height}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleColor={()=>'#b0f70e'}
        linkColor={() => '#146C94'}
        nodeColor = {() => '#19A7CE'}
        nodeCanvasObject={(node, ctx, scale)=>{textOnNode(node,ctx,scale)}}
        linkCanvasObject={(link, ctx, scale)=>{linkfix(link,ctx,scale)}}
        onNodeClick = {dispalyNode}
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
    )
}
export default graph;
