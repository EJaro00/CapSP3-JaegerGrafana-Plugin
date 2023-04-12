import React, { useEffect, useState } from "react";
import InterNodeVisLayout from "./InterNodeVisLayout";
import { Graph } from "./graphAlgorithms";
import { useAtom, useAtomValue } from "jotai";
import {
    couplingThresholdAtom,
    graphDataAtom,
    themeAtom,
} from "../utils/atoms";
import { useRouter } from "next/router";
import {
    getDegreeIn,
    getDegreeOut,
    getDuplicates,
    getNeighborsLinks,
} from "../utils/visualizer/nodeFunctions";

const TestPattern = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);
    const router = useRouter();
    const { pattern } = router.query;
    const [colorFn, setColorFn] = useState();
    const [hasThreshold, setHasThreshold] = useState(false);
    const [antipatternJSON, setAntipatternJson] = useState();
    const [threshold, setThresold] = useAtom(couplingThresholdAtom);
    const theme = useAtomValue(themeAtom);

    useEffect(() => {
        if (!pattern) return;
        getGraphDataAndColorFn(theme, pattern).then((arr) => {
            const [data, colorFn, hasThreshold, antiJson] = arr;
            setGraphData(data);
            setColorFn(() => {
                return colorFn;
            });
            setHasThreshold(hasThreshold);
            setAntipatternJson(antiJson);
            if (pattern == "knot") {
                setThresold(15);
            } else {
                setThresold(8);
            }
        });
    }, [router.query, pattern, setGraphData]);

    if (
        !pattern ||
        !graphData ||
        typeof colorFn !== "function" ||
        !antipatternJSON
    ) {
        return <></>;
    }
    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={colorFn}
                antipatternJSON={antipatternJSON}
                hasThreshold={hasThreshold}
            ></InterNodeVisLayout>
        </div>
    );
};

export default TestPattern;

const getGraphDataAndColorFn = async (theme, pattern) => {
    let data = null;
    let hasThreshold = false;
    let antiJson = null;
    let colorFn = defColorFn;

    data = await import("../public/data/red-hat.json");

    const sccs = getSccs(data);

    if (pattern === "cyclic-dependencies") {
        antiJson = await import("../utils/antipatterns/cyclic_dependency.json");

        colorFn = (node) => {
            return getCyclicColor(theme, node, sccs);
        };
    } else if (pattern === "knot") {
        antiJson = await import("../utils/antipatterns/the_knot.json");

        hasThreshold = true;
        colorFn = (node, threshold) => {
            return getKnotColor(theme, node, threshold, data);
        };
    } else if (pattern === "duplicated-service") {
        antiJson = await import(
            "../utils/antipatterns/duplicated_service.json"
        );

        hasThreshold = false;
        colorFn = (node) => {
            return getDupColor(theme, node, data);
        };
    } else if (pattern === "bottleneck") {
        antiJson = await import(
            "../utils/antipatterns/bottleneck_service.json"
        );

        hasThreshold = true;
        colorFn = (node, threshold) => {
            return getBottleneckColor(theme, node, threshold, data);
        };
    } else if (pattern === "nanoservice") {
        antiJson = await import("../utils/antipatterns/nano_service.json");

        hasThreshold = true;
        colorFn = (node, threshold) => {
            return getNanoColor(theme, node, threshold, data);
        };
    }
    return [data, colorFn, hasThreshold, antiJson];
};

const getSccs = (data) => {
    var graph = new Graph();

    if (!data) {
        return null;
    }
    const { links } = data;
    let res;
    if (typeof links[0].source === "string") {
        links.forEach((link) => {
            graph.insert(link.source, link.target);
        });
        res = graph.getStrongComponent(links[0].source);
    } else {
        links.forEach((link) => {
            graph.insert(link.source.id, link.target.id);
        });
        res = graph.getStrongComponent(links[0].source.id);
    }
    return res;
};

const getKnotColor = (theme, node, threshold, data) => {
    const { links } = data;
    let totalLinks = getNeighborsLinks(node, links);

    if (totalLinks > threshold) {
        return theme.red;
    }
    return theme.green;
};

const getCyclicColor = (theme, node, sccs) => {
    let color = null;
    sccs.forEach((scc) => {
        if (scc.length > 1 && scc.includes(node.id)) {
            color = theme.red;
        }
        if (color) return;
    });

    return color ?? theme.green;
};

function getDupColor(theme, node, data) {
    let { nodes } = data;
    var duplicates = getDuplicates(node, nodes);

    if (duplicates > 1) {
        return theme.red;
    }
    return theme.green;
}

function getBottleneckColor(theme, node, threshold, data) {
    let { links } = data;
    let numNeighbors = getDegreeIn(node, links).nodes.length;

    if (numNeighbors > threshold) {
        return theme.red;
    }
    if (numNeighbors > threshold / 2) {
        return `rgb(255,160,0)`;
    }

    return theme.green;
}

function getNanoColor(theme, node, threshold, data) {
    let { links } = data;
    let numNeighbors = getDegreeOut(node, links).nodes.length;

    if (numNeighbors > threshold) {
        return theme.red;
    }
    if (numNeighbors > threshold / 2) {
        return `rgb(255,160,0)`;
    }

    return theme.green;
}

const defColorFn = (theme) => {
    return theme.green;
};
