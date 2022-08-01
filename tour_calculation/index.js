// BUG: MAX is too small!!!!!!!!!!!!!!!!!!!!!!!!

// give appropriate maximum to avoid overflow
const MAX = Number.POSITIVE_INFINITY;

function fun(i, mask, dist, memo, n)
{
    // base case
    // if only ith bit and 1st bit is set in our mask,
    // it implies we have visited all other nodes already
    if (mask == ((1 << i) | 3))
        return dist[1][i];
    // memoization
    if (memo[i][mask] != 0)
        return memo[i][mask];

    var res = MAX; // result of this sub-problem

    // we have to travel all nodes j in mask and end the
    // path at ith node so for every node j in mask,
    // recursively calculate cost of travelling all
    // nodes in mask
    // except i and then travel back from node j to node
    // i taking the shortest path take the minimum of
    // all possible j nodes

    for (var j = 1; j < n; j++)
        if ((mask & (1 << j)) != 0 && j != i && j != 1)
            res = Math.min(res,
                        fun(j, mask & (~(1 << i)), dist, memo, n) + dist[j][i]);
    return memo[i][mask] = res;
}



module.exports = async function (context, req) {

    var latitudes, longitudes;
    latitudes = req.query['lat[]']
    longitudes = req.query['lng[]']
    latitudes = JSON.parse('[' + latitudes + ']')
    longitudes = JSON.parse('[' + longitudes + ']')

	// there are four nodes in example graph (graph is 1-based)
	const n = longitudes.length + 1;

	// dist[i][j] represents shortest distance to go from i
	// to j this matrix can be calculated for any given
	// graph using all-pair shortest path algorithms

    // initialize the 2D array 
    var dist = [];
    for(let i = 0; i < n; i++) {
        dist[i] = [];
        for(let j = 0; j < n; j++) {
            dist[i][j] = -1;
        }
    }
    // the first row are all zeros
    dist[0] = [0, 0, 0, 0, 0];
    // calculate the distance between each location
    for (var i = 1; i < n; i++) {
        dist[i][0] = 0;
        for (var j = 1; j < n; j++) {
            if (i == j) {
                dist[i][j] = 0;
            }
            else if (dist[j][i] != -1) {
                dist[i][j] = dist[j][i];
            }
            else {
                dist[i][j] = getDistance(latitudes[i-1], longitudes[i-1], latitudes[j-1], longitudes[j-1]);
            }
        }
    }

	// memoization for top down recursion
	var memo = new Array(n + 1);
    for (let i = 0; i < n+1; i++) {
        memo[i] = new Array(1 << (n + 1)).fill(0);
    }
    console.log(memo)



	// Driver program to test above logic
    var ans = MAX;
    for (var i = 1; i < n; i++)
        // try to go from node 1 visiting all nodes in
        // between to i then return from i taking the
        // shortest route to 1
        ans = Math.min(ans, fun(i, (1 << (n + 1)) - 1, dist, memo, n) + dist[i][1]);

    console.log(
        "The cost of most efficient tour = " + ans);
	

    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    // Test for getDistance()
    // lat1 = Number(req.query['a1']);
    // lat2 = Number(req.query['a2']);
    // lng1 = Number(req.query['b1']);
    // lng2 = Number(req.query['b2']);
    // console.log(getDistance(lat1, lng1, lat2, lng2))
    
    
    
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
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