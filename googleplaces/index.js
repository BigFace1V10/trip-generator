const fetch = require('node-fetch')
const cultural = ['museum', 'church', 'library', 'university', 'art gallery', 'mosque']
const natural = ['zoo', 'aquarium']
const sports = ['stadium']
const political = ['city_hall']
const famous = ['tourist_attraction']


module.exports = async function (context, req) {

    var place = req.headers['place']; // location
    var cat = req.headers['category']; // category
    var quantity = parseInt(req.headers['quantity']); // quantity
    
    // TODO: change to include every single type
    var category;
    switch(cat) {
        case 'cultural':
            category = cultural[0]
            break
        case 'natural':
            category = natural[0]
            break
        case 'sports':
            category = sports[0]
            break
        case 'political':
            category = political[0]
            break
        case 'famous':
            category = famous[0]
    }
    console.log(category);

    // build the find-places url and nearby-search url with place and category headers
    const find_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=name%2Crating%2Cgeometry&key=AIzaSyBBTbUQYs0uGEzLxVh8v8k0p4SOenbe5Cw`
    
    let nearby_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=50000&keyword=museum&key=AIzaSyBBTbUQYs0uGEzLxVh8v8k0p4SOenbe5Cw"
    // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=50000&keyword=${category}&key=AIzaSyBBTbUQYs0uGEzLxVh8v8k0p4SOenbe5Cw`    

    let response, data, sortedData, attractionArr;
    try{
        // call places api for place's information (lat and lng)
        response = await fetch(find_url, {
            method: "GET",
            headers: { }
        })
        data = await response.json()

        // add location info to nearby-search url
        var lat = data.candidates[0].geometry.location.lat;
        var lng = data.candidates[0].geometry.location.lng;
        nearby_url += `&location=${lat}%2C${lng}`

        console.log(nearby_url)

        // call nearby search api to get nearby attractions of specific category
        response = await fetch(nearby_url, {
            method: "GET",
            headers: { }
        })
        data = await response.json()
        // extract the result array from all the output data
        resultsArr = data.results
        console.log(resultsArr.length)
        // sort the array by descending order
        sortedData = resultsArr.sort((a, b) => b.rating - a.rating).slice(0, 10);
        // for loops with bad condition can block thread
        // array can do a lot: [].
        attractionArr = sortedData.sort( () => .5 - Math.random() ).slice(0, quantity);
        
        
        // console.log(sortedData)
        // // return user-input quantity of attractions into attractionArr
        // attractionArr = new Array();
        // // generate a 'quantity' of unique random numbers
        // var randomArr = randomNums(quantity, sortedData.length);
        // for (var i = 0; i < quantity; i++) {
        //     var tempPlace = {};
        //     tempPlace.name = sortedData[randomArr[i]].name;
        //     tempPlace.rating = sortedData[randomArr[i]].rating;
        //     tempPlace.vicinity = sortedData[randomArr[i]].vicinity;
        //     attractionArr.push(tempPlace);
        // }        

        
    } catch(error) {
        console.log(error)
    }

    // console.log(typeof(quantity))
    // console.log(attractionArr)
    // console.log(attractionArr.length)
    
    

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: attractionArr
    };

}

/* return a random int under "limit" (because google places may not return a lot of places) */
function randomNums(quantity, limit) {
    console.log(limit)
    var random = [];
    while (random.length < quantity) {
        var r = Math.floor(Math.random() * limit);
        if (random.indexOf(r) === -1) {
            random.push(r);
        }
    }
    return random;
}
