function showLoading() {
    document.getElementById("loading-image").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading-image").style.display = "none";
}

function showOutput() {
    document.getElementById("user-output").style.display = "block";
}

function checkLocation(location) {
    if (location == "") {
        alert("Please enter a city or location :)")
        return false;
    }
    return true;
}

function checkQuantity(q) {
    if (q <= 0 || q > 5) {
        alert("Please enter a quantity within 1~5 :)")
        return false;
    }
    return true;
}