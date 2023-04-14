

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

/**
 * Finds all nodes that make up cycles in a graph
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @returns A set containing the indices of all vertices that make up a cycle
 */
export function findCycles(vertices: string[], edges: any[]): Set<number> {
  const visited: boolean[] = new Array(vertices.length).fill(false);
  const inStack: boolean[] = new Array(vertices.length).fill(false);
  const result: Set<number> = new Set<number>;
  const stack: string[] = [];

  for (const v of vertices) {
    if (!visited[vertices.indexOf(v)]) {
      stack.push(v);

      while (stack.length > 0) {
        const curr = stack[stack.length - 1];
        const index = vertices.indexOf(curr);
        visited[index] = true;
        inStack[index] = true;

        let found = false;

        for (const e of edges) {
          if (e.source === curr) {
            const u = e.target;
            const uIndex = vertices.indexOf(u);

            if (!visited[uIndex]) {
              stack.push(u);
              found = true;
              break;
            } else if (inStack[uIndex]) {
              for (let i = vertices.indexOf(curr); i <= uIndex; i++) {
                result.add(i);
              }

              found = true;
              break;
            }
          }
        }

        if (!found) {
          stack.pop();
          inStack[index] = false;
        }
      }
    }
  }

  return result;
}
