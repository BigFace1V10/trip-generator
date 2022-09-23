# [Trip Generator App](https://www.thetripgenerator.com)

### Too Lazy To Make a Travel Plan? Try The [Trip Generator](https://www.thetripgenerator.com)!
A convenient tool to generate your unique and random trip, created with Node.js, Azure Static Web App, and Cosmos DB

## Table of Contents
- [Product Background](#project-background)
- [App Usage](#app-usage)
- [Technology](#technology)
- [Product Modules](#product-modules)
- [Incoming Features](#incoming-features)
- [Acknowledgement](#acknowledgement)

### Project Background
Let's take a look at these two situations:

> - Imagine you are on a family trip. After sitting on the plane for 6 hours, dragging all the luggages to the hotel, you are extremely exhausted and don't have any strength to make travel plan. <br>
> - Imagine you have happily made the travel plan, but when you arrive at a famous attraction only to find hundreds of thousands of tourists, you feel disappointed and only want to visit somewhere quiet but worth a visit. 

Does any of these describe you during a trip? In order to help people truly relax and acquire happiness, I started off this ***Trip Generator*** app project during a [Serverless Mentorship Program](https://www.bitproject.org/serverless) hosted by Bit Project. 

### App Usage
On the website, you could enter your location, favorite category of tourist attraction, transportation method, and number of places to go. 

After hitting "Generate My Trip!" button, the app will automatically generate a random and unique trip established on your inputs. It is worth mentioning that these trips would automatically plan a shortest route covering all the attractions. When you click on "Take me to the next attraction," a Google Map navigation page would be opened, with the starting point, destination, and transportation already chosen for you.

![Trip Generator Screenshot](https://user-images.githubusercontent.com/60641853/192043304-5f452414-2777-4972-90d5-96bf3b5d4ccb.png)

<br>Isn't that cool? Just go out and have fun without worrying about the plans!


### Technology
- JavaScript
- Node.js (16.15.0)
- Azure Serverless Functions
- Azure Cosmos DB
- Azure Blob Storage
- HTML & CSS
- Bootstrap 4

### Product Modules

- Project Structures
<img width="75%" alt="Project Structure" src="https://user-images.githubusercontent.com/60641853/192036975-25612012-1948-400f-9cfa-87672155e0ff.png">

- [Google Places API](/api/googleplaces)
<br>The Google Places API is built on the basis of Google Map's FindPlace and NearbySearch APIs. It serves the app by generating random tourist attractions based upon user inputs and output to the JS functions.
<img width="75%" alt="Google_Places API" src="https://user-images.githubusercontent.com/60641853/192037555-4697a83c-f6ec-4ba9-8922-c243b24c373a.png">


- [Route Calculations API](/api/route_calculation)
<br>The Route Calculations API is established upon a solution for the famous Travelling Salesman Problem. It serves the app by creating graph of multiple destinations and calculating the shortest route to travel through all of them, which is the final trip plan shown to the users.
<img width="75%" alt="Route_Calculation API" src="https://user-images.githubusercontent.com/60641853/192040987-344f312f-6acc-4dd6-bc31-c9da02951bb9.png">


### Incoming Features
- User Login functions for users to save their favorite trip or attraction
- Pictures & Introductions for each output attraction
- Update Google Places API algorithm to expand attraction dataset
- Connect input textfield with Google Map to improve location accuracy


### Acknowledgement
Thanks to Bit Project's Serverless Camp and Mentorship Program, I was able to successfully build the first version of this product. Especially, I would like to thank my mentor @Anthony Chu for offering me so much guidance and experience. 

For the Google Places API, I would like to thank Google for providing open-source Map API. For the Route Calculations API, I would love to thank Steven & Felix Halim, William Fiset, and Micah Stairs for their [Java solution](https://github.com/williamfiset/Algorithms/blob/master/src/main/java/com/williamfiset/algorithms/graphtheory/TspDynamicProgrammingRecursive.java#L2) of Travelling Salesman Problem.

