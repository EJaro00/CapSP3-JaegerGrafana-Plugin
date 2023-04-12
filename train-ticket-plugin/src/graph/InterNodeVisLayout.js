import React, { useRef, useState } from "react";
import Graph from "../graph/GraphWrapper";
import GraphMenu from "../graph/rightMenu/GraphMenu";
import { Menu } from "../graph/clickMenu/Menu";
import { InfoBox } from "../graph/clickMenu/InfoBox";
import AntiPatternDescription from "./AntiPatternDescription";
import Router, { useRouter } from "next/router";

const NodeVisLayout = ({
    graphColorFn,
    antipatternJSON,
    isIntraNode,
    hasThreshold,
}) => {
    /**
     * This acts as a reference to the internal force graph to call methods
     * @type {React.MutableRefObject<ForceGraphMethods>}
     * */
    const graphRef = useRef();
    const { asPath } = useRouter();

    return (
        <div className="flex flex-row justify-center items-center w-full h-screen relative z-10">
            <GraphMenu graphRef={graphRef} hasThreshold={hasThreshold} />
            <Graph
                graphRef={graphRef}
                graphColorFn={graphColorFn}
                key={"graph" + asPath}
                isIntraNode={isIntraNode}
            />
            <AntiPatternDescription data={antipatternJSON} />
            <InfoBox />
        </div>
    );
};

export default NodeVisLayout;
