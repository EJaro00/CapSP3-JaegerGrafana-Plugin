import React, {useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';


type Props = {
    width: number;
    height: number;
    myData: any;
    reference: any;
}

//Text on node(Sprite Text)
function nodeObject(node: any){
    const sprite = new SpriteText(node.id);
    // sprite.color = '#000000'
    sprite.color = node.textcolor
    sprite.textHeight = 5
    sprite.position.y = 8
    return sprite;
}

function changelinkColor(link: any){
    console.log(link);
    const feq = link.frequence;
    if(feq <= 100){
        return 'rgba(30,144,255,1)'
    }else if(feq > 100 && feq <= 500){
        return 'rgba(255,255,0,1)'
    }
    return 'rgba(255,0,0,1)'
}
const Graph2: React.FC<Props> = ({myData,width, height, reference}) =>{
    console.log(myData);
    const [clickNode, setClikNode] = useState<any>() //set click Node state

    function dispalyNode(node: any){
        setClikNode(node);
    }
    
    return (
        <>
            <ForceGraph3D
            ref={reference}
            graphData={myData}
            backgroundColor = "#000000"
            width={width}
            height={height}
            nodeLabel={'id'}
            linkLabel={'frequence'}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={3}
            linkDirectionalParticleColor={()=>'#b0f70e'}
            linkColor={(link: any) => changelinkColor(link)}
            linkWidth = {3}
            nodeAutoColorBy = {(node: any) => node.color}
            nodeThreeObjectExtend={true}
            nodeThreeObject={(node: any) => nodeObject(node)}
            onNodeClick={dispalyNode}
            d3AlphaDecay = {0.09}
            linkCurvature = {0.2}
            />

            {clickNode && (
                <div className='node-info' style={{
                    position: 'absolute',
                    bottom: '45%',
                    left:'45%',
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
    );
}

export default Graph2;
