import React, {useState } from "react";
import ForceGraph2d from "react-force-graph-2d";



type Props = {
    width: number;
    height: number;
    myData: any;
    reference: any
}

//Text on node(Sprite Text)
function textOnNode(node: any, ctx: any, globalScale: any){
    const label = node.id;
    const fontSize = 12 / globalScale;
    const nodeSize = 15 / globalScale;
    const x = node.x;
    const y = node.y;
    //draw Cycle
    ctx.beginPath();
    ctx.arc(x, y, nodeSize+3, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    //write text
    ctx.font = `${fontSize}px Sans-Serif`;
    // ctx.fillStyle = "#000";
    ctx.fillStyle = node.textcolor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
}

function changelinkColor(link: any){
    const feq = link.frequence;
    if(feq <= 100){
        return '#146C94'
    }else if(feq > 100 && feq <= 500){
        return '#F7D060'
    }
    return '#F45050'
}

const Graph: React.FC<Props> = ({myData,width,height,reference}) => {
    const [clickNode, setClikNode] = useState<any>(null) //set click Node state
    
    function dispalyNode(node: any){
        setClikNode(node);
    }

    return(
        <>
            <ForceGraph2d 
            ref={reference}
            graphData={myData}
            backgroundColor = "#0000000"
            width={width}
            height={height}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            
            linkDirectionalArrowColor = {()=>'#b0f70e'}
            linkColor={(link: any) => changelinkColor(link)}
            nodeCanvasObject={(node, ctx, scale)=>{textOnNode(node,ctx,scale)}}
            onNodeClick = {dispalyNode}
            linkCurvature = {0.4}

            />
            {clickNode && (
                <div className='node-info' style={{
                    position: 'absolute',
                    bottom: '70%',
                    left:'5%',
                    width: '350px',
                    zIndex:1000,
                    background: 'rgba(0,205,102,0.5)',
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
    )
}
export default Graph;
