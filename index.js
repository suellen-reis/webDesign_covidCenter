// config.json file is a confidential file. Ask the administrator for the details

// ####################################
// # Select data source (API or file) #
// ####################################
// Only one of the following function should be activated at a time

// Use the following function if API connection is needed
// apiConnection();

// Use the following function if file connection is needed
fileConnection();

// ----------------------------------------------------------------------------

// #######################
// # Fetch data from API #
// #######################
import config from "./data/config.json" assert { type: "json" };
function apiConnection(){
    // Get all COVID-19 data from API
    let covidEndPoint = "https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/";
    let options = {
        method: 'GET',
        headers: {
        'X-RapidAPI-Key': config[0]["key"],
        'X-RapidAPI-Host': "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com"
        }
    };

    fetch(covidEndPoint, options)
        .then(res => res.json())
        .then(json => {
            generateTableGlobal(json);
            generateTableAsia(json);
            generateTableAfrica(json);
            generateTableEurope(json);
            generateTableNorthAmerica(json);
            generateTableOceania(json);
            generateTableSouthAmerica(json);
            plotMap(json)
        })
        .catch(err => console.error('error:' + err));
    
    // Get news data from API
    let newsEndPoint = "https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/news/get-coronavirus-news/0";
    fetch(newsEndPoint, options)
        .then(res => res.json())
        .then(json => {
            generateNews(json);
        })
        .catch(err => console.error('error:' + err));
}

// ----------------------------------------------------------------------------

// #############################
// # Fetch data from JSON file #
// #############################
// Get Covid data from json
import covidJson from "./data/covid.json" assert { type: "json" };
// Get NEWS data from JSON
import news from "./data/news.json" assert { type: "json" };
function fileConnection(){
    generateTableGlobal(covidJson);
    generateTableAsia(covidJson);
    generateTableAfrica(covidJson);
    generateTableEurope(covidJson);
    generateTableNorthAmerica(covidJson);
    generateTableOceania(covidJson);
    generateTableSouthAmerica(covidJson);
    plotMap(covidJson);
    generateNews(news);
}

// ----------------------------------------------------------------------------

// ##################################
// # First container - Map plotting #
// ##################################
function unpack(objects, key) {
    return objects.map(function(object) { 
        if (key == "ThreeLetterSymbol") return object[key].toUpperCase();
        else return object[key]; 
    });
}
function plotMap(originalData){
    var rawData = [...originalData];
    rawData.splice(0, 2);
    var data = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: unpack(rawData, 'Country'),
        z: unpack(rawData, 'TotalCases'),
        zmin: 0,
        zmax: 40000000,
        // // dtick: 10000,
        marker: {
            line: {
                color: 'rgb(180,180,180)',
                width: 1
            }
        },
        colorbar: {
            autotic: false,
            title: 'Total infection cases'
        }
    }];
    
    var layout = {
        // title: 'Total infection in each country',
        margin: {"r":35,"t":0,"l":0,"b":20},
        paper_bgcolor: "#171717",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
            color:"white",
            family: "Overpass",
            size: 15
        },
        autosize: true,
        geo:{
            showframe: false,
            showcoastlines: false
        }
    };
    Plotly.newPlot("covid-map", data, layout, {showLink: false});
}

// ----------------------------------------------------------------------------

// ################################
// # First container - Data table #
// ################################

// Check the name of the columns that we want to include in the table

function isKeyAllowed(key) {
    return ["Country","TotalCases", "TotalDeaths", "TotalRecovered", "ActiveCases", "Infection_Risk"].includes(key);

}

function generateTableGlobal(data){
    generateTable(data, "All", "covidDataTable");
}

function generateTableAsia(data){
    generateTable(data, "Asia", "covidDataAsia");
}

function generateTableAfrica(data){
    generateTable(data, "Africa", "covidDataAfrica");
}

function generateTableEurope(data){
    generateTable(data, "Europe", "covidDataEurope");
}

function generateTableNorthAmerica(data){
    generateTable(data, "North America", "covidDataNorthAmerica");
}

function generateTableOceania(data){
    generateTable(data, "Australia/Oceania", "covidDataOceania");
}

function generateTableSouthAmerica(data){
    generateTable(data, "South America", "covidDataSouthAmerica");
}

function generateTable(data, continent, id){
    // Create the element table 
    var table = document.createElement("table");
    // Create the header of the table
    var header = table.createTHead();
    // Create a row for the header
    var headerRow = header.insertRow();
    // Append the name of the column to the header
    for (var key in data[0]) {
        if (isKeyAllowed(key)) {
            // Create th tag to row of header
            var headerCell = document.createElement("th");
            // Include the name of column to the cell
            // Here we can change the name of the column if we need to by replacing "key" variable
            var nameColumn = key;
            if (continent == 'All') {
                if (nameColumn === "Country"){
                    nameColumn = "";
                }
            }
            if (nameColumn === "TotalCases"){
                nameColumn = "Total Cases";
            }
            else if (nameColumn === "TotalDeaths") {
                nameColumn = "Total Deaths";
            }
            else if (nameColumn === "TotalRecovered") {
                nameColumn = "Total Recovered";
            }
            else if (nameColumn === "ActiveCases") {
                nameColumn = "Active Cases";
            }
            else if (nameColumn === "Infection_Risk") {
                nameColumn = "Infection Risk";
            }
            headerCell.innerHTML = nameColumn;
            headerRow.appendChild(headerCell);
        }

    }

    // Filter data
    if (continent == 'All') var list = data.filter(country => country.Country === "World");
    else if (continent == 'Asia') var list = data.filter(continent => continent.Continent === "Asia").slice(0,5);
    else if (continent == 'Africa') var list = data.filter(continent => continent.Continent === "Africa").slice(0,5);
    else if (continent == 'Europe') var list = data.filter(continent => continent.Continent === "Europe").slice(0,5);
    else if (continent == 'North America') var list = data.filter(continent => continent.Continent === "North America").slice(0,5);
    else if (continent == 'Australia/Oceania') var list = data.filter(continent => continent.Continent === "Australia/Oceania").slice(0,5);
    else if (continent == 'South America') var list = data.filter(continent => continent.Continent === "South America").slice(0,5);

    for (var indexRow = 0; indexRow < list.length; indexRow++) {
        // Create each row
        var row = table.insertRow();
        for (var key in list[indexRow]) {
            if (isKeyAllowed(key)) {
                var valueCell = list[indexRow][key];
                if (key != "Country") valueCell = parseInt(valueCell).toLocaleString("en-US");
                // Create a cell
                var cell = row.insertCell();
                // Include the value in the cell for a column
                cell.innerHTML = valueCell;
            }
        }
    }
    document.getElementById(id).appendChild(table);
}

// ----------------------------------------------------------------------------

// ###########################
// # Second container - News #
// ###########################
function generateNews(data){
    const MONTHS = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }
    var newsArr = data["news"];
    var newsBlocks = document.querySelectorAll(".news-blocks");
    for (var i=0; i<newsBlocks.length; i++){
        newsBlocks[i].querySelector('a').setAttribute("href", newsArr[i]["link"]);
        newsBlocks[i].querySelector('a h3').textContent = newsArr[i]["title"];
        newsBlocks[i].querySelector('a img').setAttribute("src", newsArr[i]["urlToImage"]);
        var newsDate = new Date(newsArr[i]["pubDate"]);
        var newsDateFormatted = newsDate.getDate() + " " + MONTHS[newsDate.getMonth()] + " " + newsDate.getFullYear();
        newsBlocks[i].querySelector('a p').textContent = newsDateFormatted;
    }
}  
