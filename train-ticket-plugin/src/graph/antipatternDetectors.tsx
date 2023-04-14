interface Vertex {
  id: string;
}

interface Edge {
  source: string;
  target: string;
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

/**
 * Finds all nodes that make up cycles in a graph
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @returns A set containing the indices of all vertices that make up a cycle
 */
export function findCycles(vertices: Vertex[], edges: Edge[]): Set<number> {
  const visited: boolean[] = new Array(vertices.length).fill(false);
  const inStack: boolean[] = new Array(vertices.length).fill(false);
  const stack: Vertex[] = [];
  const result: Set<number> = new Set();

  for (const v of vertices) {
    const index = vertices.indexOf(v);

    if (!visited[index]) {
      stack.push(v);

      while (stack.length > 0) {
        const curr = stack[stack.length - 1];
        const currIndex = vertices.indexOf(curr);
        visited[currIndex] = true;
        inStack[currIndex] = true;

        let found = false;

        for (const e of edges) {
          if (e.source === curr.id) {
            const u = vertices.find((v) => v.id === e.target);

            if (u === undefined) {
              console.error(`Target vertex \${e.target} not found in vertices array`);
              continue;
            }

            if (!visited[vertices.indexOf(u)]) {
              stack.push(u);
              found = true;
              break;
            } else if (inStack[vertices.indexOf(u)]) {
              for (let i = currIndex; i <= vertices.indexOf(u); i++) {
                result.add(i);
              }

              found = true;
              break;
            }
          }
        }

        if (!found) {
          stack.pop();
          inStack[currIndex] = false;
        }
      }
    }
  }

  return result;
}