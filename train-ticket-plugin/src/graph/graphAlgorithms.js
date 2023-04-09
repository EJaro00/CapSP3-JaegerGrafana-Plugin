export class Graph {
    constructor() {
        this.list = {};
    }

    insert(newVertex, neighborVertex) {
        if (!this.list[newVertex]) {
            if (neighborVertex) {
                this.list[newVertex] = [neighborVertex];
            } else {
                this.list[newVertex] = [];
            }
        } else {
            // If neighborVertex is not initialized
            if (!this.list[neighborVertex]) {
                this.list[neighborVertex] = [];
            }

            // Add neighborVertex to
            this.list[newVertex].push(neighborVertex);
        }
    }

    addEdge(vertexFrom, vertexTo) {
        if (this.list[vertexFrom] || this.list[vertexTo]) {
            throw new Error("Vertex does not exsists");
        }

        this.list[vertexFrom].push(vertexTo);
    }

    dfs(graph, vertex, callback, visited) {
        // track which node visited
        var visited = visited || {};

        // Take graph as option
        var list = graph ? graph : this.list;

        if (visited[vertex]) return;

        // Mark vertex as visited
        visited[vertex] = true;

        // Iterate adjacent nodes
        if (list[vertex]) {
            for (var neighbor of list[vertex]) {
                // If the vertex is not visited, push each nodes to stack
                if (!visited[neighbor]) {
                    this.dfs(list, neighbor, callback, visited);
                }
            }
        }

        callback(vertex);
        }

    getStrongComponent(vertex) {
        if (vertex && !this.list[vertex]) {
            console.log(vertex);
            throw new Error("Vertex DNE");
        }

        vertex = vertex
            ? vertex.toString()
            : Object.keys(this.list)[0].toString();

        /*
        Create Copy of current Adjacency list
        */
        var reverseEdgeGraph = getReverseGraph(this.list);
        var stack = [];
        var visited = {};
        for (var vertex in this.list) {
            this.dfs(
                null,
                vertex,
                function (v) {
                    stack.push(v);
                },
                visited
            );
        }

        var allSCC = [];
        visited = {};
        stack.reverse().forEach((vertex) => {
            var SCC = [];
            this.dfs(
                reverseEdgeGraph,
                vertex,
                function (v) {
                    SCC.push(v);
                },
                visited
            );
            if (SCC.length) allSCC.push(SCC);
        });

        return allSCC;
    }
}

function getReverseGraph(graph) {
    var vertices = Object.keys(graph);
    var reverseEdgeGraph = {};

    for (let vertex of vertices) {
        for (let neighbor of graph[vertex]) {
            if (reverseEdgeGraph[neighbor]) {
                reverseEdgeGraph[neighbor].push(vertex);
            } else {
                reverseEdgeGraph[neighbor] = [vertex];
            }
        }
    }

    return reverseEdgeGraph;
}
