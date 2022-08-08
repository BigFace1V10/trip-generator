const fetch = require('node-fetch')
const famous = ['tourist_attraction']
const cultural = ['museum', 'church', 'library', 'university', 'art_gallery', 'mosque']
const natural = ['national park', 'park', 'beach', 'cave', 'cliff', 'mountain', 'waterfall', 'island', 'forest', 'zoo', 'aquarium']
const sports = ['stadium', 'field', 'complex', 'hall of fame', 'park']
const leisure = ['amusement park', 'market', 'exhibition', 'theatre', 'movie theatre']
const political = ['city_hall', 'memorial']

module.exports = async function (context, req) {

    var place = req.headers['place']; // location
    var cat = req.headers['category']; // category
    var quantity = parseInt(req.headers['quantity']); // quantity
    let response, data, attractionArr = [];

    // build the find-places url and nearby-search url with place and category headers
    const find_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=name%2Crating%2Cgeometry&key=${process.env.GOOGLE_PLACES_API_KEY}`
    // call places api for place's information (lat and lng)
    response = await fetch(find_url, {
        method: "GET",
        headers: { }
    })
    data = await response.json()
    console.log(data)
    // add location info to nearby-search url
    var lat = data.candidates[0].geometry.location.lat;
    var lng = data.candidates[0].geometry.location.lng;
    
    // decide the category
    var category;
    switch(cat) {
        case 'famous':
            category = famous
            break
        case 'cultural':
            category = cultural
            break
        case 'natural':
            category = natural
            break
        case 'sports':
            category = sports
            break
        case 'leisure':
            category = leisure
            break
        case 'political':
            category = political
            break  
    }

    // get nearby attraction for each type in the big category
    for (let i = 0; i < category.length; i++) {
        let sortedData = await getNearbyAttraction(category[i], lat, lng);
        attractionArr.push(...sortedData); // ... could push all the elements in sortedData into attractionArr
        console.log(category[i])
        console.log(attractionArr.length)
    }
    
    // sort the attraction array that contains ~10 attractions for each type
    attractionArr = attractionArr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, quantity)

    // capitalize the first letter of each word in "place" string
    const words = place.split(" ");
    place = words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");

    // Add the starting location of user into the head of attraction array
    attractionArr.splice(0, 0, {
        name: place,
        geometry: {
            location: {
                lat: lat,
                lng: lng
            }
        }
    })
    console.log(attractionArr)
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: attractionArr
    };

}

async function getNearbyAttraction(type, lat, lng) {
    var response, data, sortedData;

    let nearby_url;
    if (type == 'tourist_attraction') {
        nearby_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=50000&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    }
    else {
        nearby_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=50000&keyword=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`    
    }
    nearby_url += `&location=${lat}%2C${lng}`

    // call nearby search api to get nearby attractions of specific category
    response = await fetch(nearby_url, {
        method: "GET",
        headers: { }
    })

    data = await response.json()
    // extract the result array from all the output data
    resultsArr = data.results
    // console.log(resultsArr.length)
    // sort the array by descending order
    sortedData = resultsArr.sort((a, b) => b.rating - a.rating)//.slice(0, 10);
    // for loops with bad condition can block thread
    // array can do a lot: [].
    return sortedData;
    // sortedData.sort( () => .5 - Math.random() ).slice(0, quantity);    

}
