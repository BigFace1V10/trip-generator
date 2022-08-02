/* 
 * 
 * The original code (in Java) comes from:
 * @author Steven & Felix Halim, William Fiset, Micah Stairs
 * Original repo link: https://github.com/williamfiset/Algorithms/blob/master/src/main/java/com/williamfiset/algorithms/graphtheory/TspDynamicProgrammingRecursive.java#L2
 */

class RouteGenerator
{
    #N = 0;
    #START_NODE = 0;
    #FINISHED_STATE = 0;
    #distance = [];
    #minTourCost = Infinity;
    #tour = new Array();
    #ranSolver = false;

    constructor(startNode, distance)
    {
        this.#distance = distance;
        this.#N = distance.length;
        this.#START_NODE = startNode;
        // Validate inputs.
        if (this.#N <= 2)
        {
            throw new Error("TSP on 0, 1 or 2 nodes doesn\'t make sense.");
        }
        if (this.#N != distance[0].length)
        {
            throw new Error("Matrix must be square (N x N)");
        }
        if (this.#START_NODE < 0 || this.#START_NODE >= this.#N)
        {
            throw new Error("Starting node must be: 0 <= startNode < N");
        }
        if (this.#N > 32)
        {
            throw new Error("Matrix too large! A matrix that size for the DP TSP problem with a time complexity ofO(n^2*2^n) requires way too much computation for any modern home computer to handle");
        }
        // The finished state is when the finished state mask has all bits are set to one (meaning all the nodes have been visited).
        this.#FINISHED_STATE = (1 << this.#N) - 1;
    }

    // Returns the optimal tour for the traveling salesman problem.
    getTour()
    {
        if (!this.#ranSolver)
        {
            this.solve();
        }
        return this.#tour;
    }

    // Returns the minimal tour cost.
    getTourCost()
    {
        if (!this.#ranSolver)
        {
            this.solve();
        }
        return this.#minTourCost;
    }

    tsp(i, state, memo, prev)
    {
        // Done this tour. Return cost of going back to start node.
        if (state == this.#FINISHED_STATE)
        {
            return this.#distance[i][this.#START_NODE];
        }
        // Return cached answer if already computed.
        if (memo[i][state] != null)
        {
            return memo[i][state];
        }

        var minCost = Infinity;
        var index = -1;
        for (var next = 0; next < this.#N; next++)
        {
            // Skip if the next node has already been visited.
            if ((state & (1 << next)) != 0)
            {
                continue;
            }
            var nextState = state | (1 << next);
            var newCost = this.#distance[i][next] + this.tsp(next, nextState, memo, prev);
            if (newCost < minCost)
            {
                minCost = newCost;
                index = next;
            }
        }
        prev[i][state] = index;
        return memo[i][state] = minCost;
    }

    solve()
    {
        // Run the solver
        var state = 1 << this.#START_NODE;
        var memo = Array(this.#N).fill(null).map(()=>new Array(1 << this.#N).fill(null));
        var prev = Array(this.#N).fill(null).map(()=>new Array(1 << this.#N).fill(null));
        this.#minTourCost = this.tsp(this.#START_NODE, state, memo, prev);
        // Regenerate path
        var index = this.#START_NODE;
        while (true)
        {
            this.#tour.push(index);
            var nextIndex = prev[index][state];
            if (nextIndex == null)
            {
                break;
            }
            var nextState = state | (1 << nextIndex);
            state = nextState;
            index = nextIndex;
        }
        this.#tour.push(this.#START_NODE);
        this.#ranSolver = true;
    }
}

module.exports = async function(context, req) {
    // RouteGenerator.main([]);

    var latitudes, longitudes;
    latitudes = req.query['lat[]']
    longitudes = req.query['lng[]']
    latitudes = JSON.parse('[' + latitudes + ']')
    longitudes = JSON.parse('[' + longitudes + ']')

	// there are four nodes in example graph (graph is 1-based)
	const n = longitudes.length;

	// dist[i][j] represents shortest distance to go from i
	// to j this matrix can be calculated for any given
	// graph using all-pair shortest path algorithms

    // initialize the 2D array 
    var dist = Array(n).fill(-1).map(()=>new Array(n).fill(-1));

    // var dist = [];
    // for(let i = 0; i < n; i++) {
    //     dist[i] = [];
    //     for(let j = 0; j < n; j++) {
    //         dist[i][j] = -1;
    //     }
    // }
    // // the first row are all zeros
    // dist[0] = [0, 0, 0, 0, 0];

    console.log(dist)
    // calculate the distance between each location
    for (var i = 0; i < n; i++) {
        dist[i][0] = 0;
        for (var j = 0; j < n; j++) {
            if (i == j) {
                dist[i][j] = 0;
            }
            else if (dist[j][i] != -1) {
                dist[i][j] = dist[j][i];
            }
            else {
                dist[i][j] = getDistance(latitudes[i], longitudes[i], latitudes[j], longitudes[j]);
            }
        }
    }
    console.log(dist);

    var solver = new RouteGenerator(0, dist);
    // Prints: [0, 3, 2, 4, 1, 5, 0]
    var solution = solver.getTour();
    console.log(solution);
    console.log(typeof(solution))
    // console.log("Tour: " + solver.getTour());
    // Print: 42.0
    console.log("Tour cost: " + solver.getTourCost());

    context.res = {
        body: solution
    }

}


/*
    Haversince Formula:
    Function for calculating two points' distance on Earth surface
    Edited from: https://www.geeksforgeeks.org/program-distance-two-points-earth/
*/
function getDistance(lat1, lng1, lat2, lng2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;

    // Haversine formula
    let dlng = lng2 - lng1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlng / 2),2);
            
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
}