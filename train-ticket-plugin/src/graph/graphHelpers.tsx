
/**
 * Finds one strongly connected component (SCC) in a graph using DFS.
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param visited Array of booleans telling us whether the corresponding vertex has been visited
 * @param currentNode The current node we're visiting for this iteration of dfs
 * @param stack Stack used to keep track of nodes in the current SCC
 */
function dfsSCC(vertices: any[], edges: any[], visited: boolean[], currentNode: number, stack: any[]): void {
  visited[currentNode] = true;
  stack.push(currentNode);

  for (let i = 0; i < edges.length; i++) {
    //If the edge starts from our current node, continue DFS from the target node
      if (edges[i]["source"] === vertices[currentNode]["name"] && !visited[vertices.findIndex(vertex => vertex["name"] === edges[i]["target"])]) {
          dfsSCC(vertices, edges, visited, vertices.findIndex(vertex => vertex["name"] === edges[i]["target"]), stack);
      }
  }
}

/**
* Finds all strongly connected components (SCCs) in a graph using DFS.
* @param vertices Array of all vertices in our graph
* @param edges Array of all vertex-to-vertex edges in our graph
* @returns An array of arrays, each inner array containing the vertices that form a strongly connected component
*/
function findSCCs(vertices: any[], edges: any[]): number[][] {
  const visited: boolean[] = new Array(vertices.length).fill(false);
  const stack: any[] = [];
  const sccs: number[][] = [];

  for (let i = 0; i < vertices.length; i++) {
      if (!visited[i]) {
          dfsSCC(vertices, edges, visited, i, stack);
          let scc: number[] = [];
          let currentNode: any;
          do {
            //copy all nodes from stack into SCC
              currentNode = stack.pop();
              scc.push(currentNode);
          } while (currentNode !== i);
          //save SCC
          sccs.push(scc);
      }
  }

  return sccs;
}

/**
 * Returns the indegree of a node in a graph
 * @param node The node we are investigating
 * @param edges The array of all edges in the graph
 * @returns The number of edges pointing towards this node (indegree)
 */
function getDegreeIn(node: any, edges: any[]): number {
  let retVal: number = 0;

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
  let retVal: number = 0;

  retVal = edges.filter(link => link.source === node.name).length;

  return retVal;
}

/**
 * Finds all nodes that make up cycles in a graph
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @returns An array containing a boolean for each vertex - true if it's part of a cycle, false otherwise
 */
export function findCycles(vertices: any[], edges: any[]): boolean[]{

  const retVal: boolean[] = new Array(vertices.length).fill(false);
  let sccs: number[][] = findSCCs(vertices, edges);
  let index : number = 0;

  for(let i = 0; i < sccs.length; i++){
      //If the SCC contains more than one node, every node in the SCC is part of a cycle.
      if(sccs[i].length > 1){
          for(let k = 0; k < sccs[i].length; k++){
              index = sccs[i][k];
              retVal[index] = true;
          }
      }
  }

  return retVal;

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
