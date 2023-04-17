interface Graph {
  [node: string]: string[];
}

/**
 * Returns the indegree of a node in a graph
 * @param node The node we are investigating
 * @param edges The array of all edges in the graph
 * @returns The number of edges pointing towards this node (indegree)
 */
function getDegreeIn(node: any, edges: any[]): number {
  let retVal = 0;


  retVal = edges.filter(link => link.target === node.name).length;

  return retVal;
}

/**
 * Returns the outdegree of a node in a graph
 * @param node The node we are investigating
 * @param edges The array of all edges in the graph
 * @returns The number of edges pointing away from this node (outdegree)
 */
function getDegreeOut(node: any, edges: any[]): number {
  let retVal = 0;

  retVal = edges.filter(link => link.source === node.name).length;

  return retVal;
}

/**
 * Finds all bottleneck vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a bottleneck
 * @returns An array containing a set of all vertex indices that correspond to a bottleneck vertex
 */
export function findBottlenecks(vertices: any[], edges: any[], threshold: number): Set<number> {

  let retVal = new Set<number>;

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeIn(vertices[i], edges) > threshold){
      retVal.add(i);
    }
  }

  return retVal;

}

/**
 * Finds all nanoservice vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a nanoservice
 * @returns An array containing a set of all vertex indices that correspond to a nanoservice vertex
 */
export function findNanoservices(vertices: any[], edges: any[], threshold: number): Set<number>{
  
  let retVal = new Set<number>;

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeOut(vertices[i], edges) > threshold){
      retVal.add(i);
    }
  }

  return retVal;
}

/*
 Fixed part in bleow
*/

/**
 * Find all nodes that make up cycles in a graph
 * @param nodes a node array of all ndoes in our graph
 * @param edges Array of all node to node edges in our graph
 * @returns A array containing the node id that make up a cycle
 */
export function findCycles(nodes: any[], edges: any[]): string[] {
  const graph: Graph = buildGraph(nodes, edges);
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const circularNodes: string[] = [];

  for (const node of nodes) {
    const nodeId = node.id;
    if (!visited.has(nodeId)) {
      dfs(nodeId, graph, visited, visiting, circularNodes);
    }
  }

  return circularNodes;
}

function buildGraph(nodes: any[], edges: any[]): Graph {
  const graph: Graph = {};
  for (const node of nodes) {
    graph[node.id] = [];
  }
  for (const edge of edges) {
    const source = edge.source;
    const target = edge.target;
    graph[source].push(target);
  }
  return graph;
}

function dfs(node: string, graph: Graph, visited: Set<string>, visiting: Set<string>, circularNodes: string[], path: string[] = []) {
  visited.add(node);
  visiting.add(node);
  path.push(node);

  for (const neighbor of graph[node]) {
    if (visited.has(neighbor)) {
      if (visiting.has(neighbor)) {
        circularNodes.push(...path.slice(path.indexOf(neighbor)));
      }
    } else {
      dfs(neighbor, graph, visited, visiting, circularNodes, path);
    }
  }

  visiting.delete(node);
  path.pop();
}
