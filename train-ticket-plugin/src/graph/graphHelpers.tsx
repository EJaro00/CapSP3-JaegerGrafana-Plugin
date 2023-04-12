
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
export function findSCCs(vertices: any[], edges: any[]): number[][] {
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
