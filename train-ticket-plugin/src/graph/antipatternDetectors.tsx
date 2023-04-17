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

  retVal = edges.filter(link => link.target === node.id && link.source !== node.id).length;

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

  retVal = edges.filter(link => link.source === node.id && link.target !== node.id).length;

  return retVal;
}

/**
 * returns the Levenshtein Distance between two strings
 * @param a The first string to compare
 * @param b The second string to compare
 * @returns The Levenshtein Distance between both strings
 */
const levenshtein = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length })
                      .map(() => Array.from({ length: b.length })
                                      .map(() => 0))

  for (let i = 0; i < a.length; i++) matrix[i][0] = i

  for (let i = 0; i < b.length; i++) matrix[0][i] = i

  for (let j = 0; j < b.length; j++)
    for (let i = 0; i < a.length; i++)
      matrix[i][j] = Math.min(
        (i == 0 ? 0 : matrix[i - 1][j]) + 1,
        (j == 0 ? 0 : matrix[i][j - 1]) + 1,
        (i == 0 || j == 0 ? 0 : matrix[i - 1][j - 1]) + (a[i] == b[j] ? 0 : 1)
      )

  return matrix[a.length - 1][b.length - 1]
}

/**
 * Finds all bottleneck vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a bottleneck
 * @returns A set of all vertex id's that correspond to a bottleneck vertex
 */
export function findBottlenecks(vertices: any[], edges: any[], threshold: number): Set<string> {

  let retVal = new Set<string>;

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeIn(vertices[i], edges) > threshold){
      retVal.add(vertices[i].id);
    }
  }

  return retVal;

}

/**
 * Finds all potential duplicate services in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param threshold The user-defined threshold for the maximum levenshtein distance of duplicate services
 * @returns The set of all vertex id's that correspond to duplicate services
 */
export function findDuplicates(vertices: any[], threshold: number): Set<string> {

  let retVal = new Set<string>;

  for(let i = 0; i < vertices.length - 1; i++){
    for(let j = i + 1; j < vertices.length; j++){
      if(levenshtein(vertices[i].id, vertices[j].id) < threshold){
        retVal.add(vertices[i].id).add(vertices[j].id);
      }
    }
  }

  return retVal;
}

/**
 * Finds all nanoservice vertices in a graph according to a threshold
 * @param vertices Array of all vertices in our graph
 * @param edges Array of all vertex-to-vertex edges in our graph
 * @param threshold The user-defined threshold for how many edges create a nanoservice
 * @returns A set of all vertex id's that correspond to a nanoservice vertex
 */
export function findNanoservices(vertices: any[], edges: any[], threshold: number): Set<string>{
  
  let retVal = new Set<string>;

  for(let i = 0; i < vertices.length; i++){
    if(getDegreeOut(vertices[i], edges) > threshold){
      retVal.add(vertices[i].id);
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
