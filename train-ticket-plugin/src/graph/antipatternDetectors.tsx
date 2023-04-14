
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
 * Finds one strongly connected component (SCC) in a graph using DFS.
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param visited Array of booleans telling us whether the corresponding vertex has been visited
 * @param currentNode The current node we're visiting for this iteration of dfs
 * @param stack Stack used to keep track of nodes in the current SCC
 * @param lowest Array that keeps track of the lowest node reachable from each node
 * @param path Array that keeps track of the current path in the DFS tree
 * @param cycles Array that keeps track of whether each node is part of a cycle
 */
function dfsSCC(vertices: any[], edges: any[], visited: boolean[], currentNode: number, stack: any[], lowest: number[], path: boolean[], cycles: boolean[]): void {
  visited[currentNode] = true;
  stack.push(currentNode);
  lowest[currentNode] = currentNode;
  path[currentNode] = true;

  for (let i = 0; i < edges.length; i++) {
    if (edges[i].source === vertices[currentNode].id) {
      const targetNodeIndex = vertices.findIndex(vertex => vertex.id === edges[i].target);
      if (!visited[targetNodeIndex]) {
        dfsSCC(vertices, edges, visited, targetNodeIndex, stack, lowest, path, cycles);
      }
      if (path[targetNodeIndex]) {
        lowest[currentNode] = Math.min(lowest[currentNode], lowest[targetNodeIndex]);
      }
    }
  }

  if (lowest[currentNode] === currentNode) {
    let node;
    do {
      node = stack.pop();
      path[node] = false;
      cycles[node] = true;
    } while (node !== currentNode);
  }
}

/**
 * Finds all nodes that make up cycles in a graph
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @returns An array containing a boolean for each vertex - true if it's part of a cycle, false otherwise
 */
export function findCycles(vertices: any[], edges: any[]): boolean[]{
  const visited: boolean[] = new Array(vertices.length).fill(false);
  const stack: any[] = [];
  const lowest: number[] = new Array(vertices.length).fill(Infinity);
  const path: boolean[] = new Array(vertices.length).fill(false);
  const cycles: boolean[] = new Array(vertices.length).fill(false);

  for (let i = 0; i < vertices.length; i++) {
    if (!visited[i]) {
      dfsSCC(vertices, edges, visited, i, stack, lowest, path, cycles);
    }
  }

  return cycles;
}


/**
 * Finds all bottleneck vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a bottleneck
 * @returns An array containing a boolean for each vertex - true if it's a bottleneck, false otherwise
 */
export function findBottlenecks(vertices: any[], edges: any[], threshold: number): boolean[] {

  const retVal: boolean[] = new Array(vertices.length).fill(false);

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeIn(vertices[i], edges) > threshold){
      retVal[i] = true;
    }
  }

  return retVal;

}

/**
 * Finds all nanoservice vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a nanoservice
 * @returns An array containing a boolean for each vertex - true if it's a nanoservice, false otherwise
 */
export function findNanoservices(vertices: any[], edges: any[], threshold: number): boolean[] {
  
  const retVal: boolean[] = new Array(vertices.length).fill(false);

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeOut(vertices[i], edges) > threshold){
      retVal[i] = true;
    }
  }

  return retVal;
}
