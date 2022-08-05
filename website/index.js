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
        console.log(data)
        outputData(data);

        // create search parameters for the route_calculation function
        let params = new URLSearchParams();
        for (var i = 0; i < data.length; i++) {
            params.append('lat[]', data[i].geometry.location.lat);
            params.append('lng[]', data[i].geometry.location.lng);
        }
        // TODO: call the route_calculation function and change the output into the route!
        const route_url = "https://noah-serverless-project.azurewebsites.net/api/route_calculation?code=O-zgqfoiRssvY8OWPilpA4yHdLFf5fj9YFgP1a7g4Y_SAzFu1Ut6hw==&";
        const route_resp = await fetch(route_url + params);
        console.log(route_resp);
        const route = await route_resp.json();
        outputRoute(route, data);


    } catch(err) {
        console.log(err);
    }


})


// create divs for each place and display with tidiness
function outputData(data) {
    output.innerHTML = ""
    for (var i = 1; i < data.length; i++) {
        // console.log(data[i])
        var div = document.createElement("div");
        div.innerHTML = 'Name: ' + data[i].name + '<br>rating: ' + data[i].rating + '<br>Address: ' + data[i].vicinity + '<br>location: ' + data[i].geometry.location.lat + ',' + data[i].geometry.location.lng + '<br>';

        div.setAttribute(
            'style',
            'padding: 5px; border: 2px solid rgb(0, 166, 255); border-radius: 5px;'
        )
        output.appendChild(div);

        // append a div with left border (representing a connection line)
        if (i+1 == data.length) {
            continue;
        }
        var vertical_line = document.createElement("div");
        vertical_line.setAttribute(
            'style',
            'width: 80%; margin-left: 10%; padding: 10%; height: 20px; border-left: 2px dotted rgb(0, 166, 255);'
        )
        var a = document.createElement("a");
        var prompt = document.createTextNode("Take me to the next attraction");
        a.appendChild(prompt);

        var navi_link = "https://www.google.com/maps/dir/?api=1"
        navi_link += `&origin=${encodeURIComponent(data[i].name)}&origin_place_id=${data[i].place_id}&destination=${encodeURIComponent(data[i+1].name)}&destination_place_id=${data[i+1].place_id}`
        console.log(navi_link);

        a.href = navi_link;
        vertical_line.appendChild(a);
        output.appendChild(vertical_line);
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