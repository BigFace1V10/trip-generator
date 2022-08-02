const travelForm = document.getElementById('travelForm');
const output = document.getElementById("output");

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
        

    } catch(err) {
        console.log(err);
    }



})


// create divs for each place and display with tidiness
function outputData(data) {
    output.innerHTML = ""
    for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = 'Name: ' + data[i].name + '<br>rating: ' + data[i].rating + '<br>Address: ' + data[i].vicinity + '<br><br>';
        output.appendChild(div);
    }
}