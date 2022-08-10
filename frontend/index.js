const travelForm = document.getElementById('travelForm');
const output = document.getElementById("output");
const route_output = document.getElementById("route_output");

travelForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const location = document.getElementById("location").value
    const category = document.getElementById("category").value
    const quantity = document.getElementById("quantity").value
    const transportation = document.getElementById("transportation").value

    var check1 = checkLocation(location);
    var q = parseInt(quantity);
    var check2 = checkQuantity(q);
    if (!check1 || !check2) {
        return;
    }
    showLoading();

    try {
        const endpoint = "https://noah-serverless-project.azurewebsites.net/api/googleplaces?code=Gx8MkLrov3FC0UoIIdv3zUc_hIB37epvR6zHUzHseGUXAzFutk99JA==";
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
        const route_url = "https://noah-serverless-project.azurewebsites.net/api/route_calculation?code=O-zgqfoiRssvY8OWPilpA4yHdLFf5fj9YFgP1a7g4Y_SAzFu1Ut6hw==&";
        const route_resp = await fetch(route_url + params);
        const route = await route_resp.json();
        // outputRoute(route, data);
        displayTrip(route, data, transportation);
        // switch display from loading to output
        hideLoading()
        showOutput()

    } catch(err) {
        console.log(err);
    }
})


function displayTrip(route, data, transportation) {
    output.innerHTML = ""
    for (var i = 0; i < route.length; i++) {
        var attIndex = route[i];
        var div = document.createElement("div");
        if (i == 0 || i == route.length-1) {
            div.innerHTML = 'Name: ' + data[attIndex].name
        }
        else {
            div.innerHTML = 'Name: ' + data[attIndex].name + '<br>Rating: ' + data[attIndex].rating + '<br>Address: ' + data[attIndex].vicinity;
        }

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
        navi_link += `&origin=${encodeURIComponent(data[attIndex].name)}&origin_place_id=${data[attIndex].place_id}&destination=${encodeURIComponent(data[route[i+1]].name)}&destination_place_id=${data[route[i+1]].place_id}&travelmode=${transportation}`;
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


// Why can't this work?
function switchLoading() {
    let displayStatus = document.getElementById("loading-image").style.display;
    console.log(displayStatus)
    if (displayStatus == "none") {
        document.getElementById("loading-image").style.display = "block";
    }
    else if (displayStatus == "block") {
        document.getElementById("loading-image").style.display = "none";
    }
}

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

