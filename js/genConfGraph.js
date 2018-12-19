// This file contains functions for making the routing graph

function createConfGraph (graph) {
    var routingGraph = {};
    routingGraph.actualLinks = graph.links;

    // Push the nodes
    routingGraph.nodes = graph.nodes;
    // mark each node as not routingNode
    routingGraph.nodes.forEach(function (elem) {
        elem.isRouting = false;
    });

    graph.PGmodules.forEach(function (elem) {
        routingGraph.nodes.push({
            "id": elem.id,
            "isRouting": true
        }); // Each module is a routing node
    });

    // Push the edges
    routingGraph.links = graph.PGlinks;
    graph.PGmodules.forEach(function (elem) {
        var elemNodes = elem.elements.nodes;
        var elemModules = elem.elements.modules;

        // Edges from current module to child nodes
        elemNodes.forEach(function (e) {
            routingGraph.links.push({
                "source": elem.id,
                "target": e
            });
        });

        // Edges from current module to child modules
        elemModules.forEach(function (e) {
            routingGraph.links.push({
                "source": elem.id,
                "target": e
            });
        });

    });

    routingNodes = routingGraph.nodes;
    routingEdges = routingGraph.links;
    actualEdges = routingGraph.actualLinks;

    var dijkstra_graph = make_graph(routingEdges);

    var confluentEdges = [];

    // for each actual edge find the shortest path in the routing graph and render it as a curve later
    actualEdges.forEach(function (edge) {
        confluentEdges.push(dijkstra(dijkstra_graph, edge.source, edge.target));
    });

    var confluentGraph = {
        "nodes": routingNodes,
        "links": routingEdges,
        "confLinks": confluentEdges
    };

    // everything done
    return confluentGraph;
}

