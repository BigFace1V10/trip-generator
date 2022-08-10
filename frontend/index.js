const travelForm = document.getElementById('travelForm');
const output = document.getElementById("output");
const route_output = document.getElementById("route_output");

travelForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const location = document.getElementById("location").value
    const category = document.getElementById("category").value
    const quantity = document.getElementById("quantity").value

    var q = parseInt(quantity);
    if (q <= 0 || q > 5) {
        output.innerHTML = "Please enter a quantity between 1 and 5"
        return;
    }

    try {
        const endpoint = "/api/googleplaces"
        const options = {
            method: "GET",
            headers: {
                'place': location,
                'category': category,
                'quantity': quantity
            }
        };
        const resp = await fetch(endpoint, options);
        const data = await resp.json();

        // create search parameters for the route_calculation function
        let params = new URLSearchParams();
        for (var i = 0; i < data.length; i++) {
            params.append('lat[]', data[i].geometry.location.lat);
            params.append('lng[]', data[i].geometry.location.lng);
        }
        // call the route_calculation function and output the route!
        const route_url = "/api/route_calculation?"
        const route_resp = await fetch(route_url + params);
        const route = await route_resp.json();
        // outputRoute(route, data);
        displayTrip(route, data);

    } catch(err) {
        console.log(err);
    }
})


function displayTrip(route, data) {
    output.innerHTML = ""
    for (var i = 0; i < route.length; i++) {
        var attIndex = route[i];
        var div = document.createElement("div");
        div.innerHTML = 'Name: ' + data[attIndex].name + '<br>Rating: ' + data[attIndex].rating + '<br>Address: ' + data[attIndex].vicinity;

        // set the attribute for attraction box
        div.setAttribute(
            'style',
            'padding: 5px; border: 2px solid rgb(0, 166, 255); border-radius: 5px;'
        )
        output.appendChild(div);

        // append a div with left border (representing a connection line)
        if (i+1 == route.length) {
            continue;
        }
        
        // form a navigation link with prompt
        var a = document.createElement("a");
        var prompt = document.createTextNode("Take me to the next attraction");
        a.appendChild(prompt);

        // form the link to Google Map
        var navi_link = "https://www.google.com/maps/dir/?api=1"
        navi_link += `&origin=${encodeURIComponent(data[attIndex].name)}&origin_place_id=${data[attIndex].place_id}&destination=${encodeURIComponent(data[route[i+1]].name)}&destination_place_id=${data[route[i+1]].place_id}`;
        a.href = navi_link;
        a.target = "_blank";

        // form a vertical line with the link 
        var vertical_line = document.createElement("div");
        vertical_line.setAttribute(
            'style',
            'width: 80%; margin-left: 10%; padding: 10%; height: 20px; border-left: 2px dotted rgb(0, 166, 255);'
        )
        vertical_line.appendChild(a);
        output.appendChild(vertical_line);
    }
}

/* the following functions are auxiliary functions for development and debug */

// create divs for each attraction and display with tidiness
function outputData(data) {
    output.innerHTML = ""
    // the first attraction is the user's input location
    for (var i = 1; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = 'Name: ' + data[i].name + '<br>rating: ' + data[i].rating + '<br>Address: ' + data[i].vicinity + '<br>location: ' + data[i].geometry.location.lat + ',' + data[i].geometry.location.lng + '<br><br>';
        console.log(div.innerHTML)
        output.appendChild(div);
    }
}

function outputRoute(route, attractions) {
    route_output.innerHTML = "";
    var text = document.createElement("p");
    text.innerHTML = "Best Route: "
    for (var i = 0; i < route.length; i++) {
        text.innerHTML += attractions[route[i]].name;
        if ((i+1) != route.length) {
           text.innerHTML += " ---> "
        }
    }
    console.log(text);
    route_output.appendChild(text);
}

