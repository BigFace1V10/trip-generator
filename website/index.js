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