
/**
 * Finds one strongly connected component (SCC) in a graph using DFS.
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param visited Array of booleans telling us whether the corresponding vertex has been visited
 * @param currentNode The current node we're visiting for this iteration of dfs
 * @param stack Stack used to keep track of nodes in the current SCC
 */
function dfsSCC(vertices: any[], edges: any[], visited: boolean[], currentNode: number, stack: number[]): void {
  visited[currentNode] = true;
  stack.push(currentNode);

  for (let i = 0; i < edges.length; i++) {
      if (edges[i][0] === currentNode && !visited[edges[i][1]]) {
          dfsSCC(vertices, edges, visited, edges[i][1], stack);
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
  const stack: number[] = [];
  const sccs: number[][] = [];

  for (let i = 0; i < vertices.length; i++) {
      if (!visited[i]) {
          dfsSCC(vertices, edges, visited, i, stack);
          let scc: number[] = [];
          let currentNode: number;
          do {
              currentNode = stack.pop();
              scc.push(currentNode);
          } while (currentNode !== i);
          sccs.push(scc);
      }
  }

  return sccs;
}
