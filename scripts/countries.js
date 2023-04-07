import history from "/data/historical.json" assert { type: "json" };
import covidJson from "/data/covid.json" assert { type: "json" };

function plotHistorical(data, plottingCountry){
    let filteredData = data.filter(country => country.symbol === plottingCountry);
    filteredData.sort(function compare(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      });
    let dateAxis = [];
    let newCase = [];
    let newDeath = [];
    let accCase = [];
    let accDeath = [];
    for(var i=0; i<filteredData.length; i++){
        dateAxis.push(filteredData[i]["date"]);
        newCase.push(filteredData[i]["new_cases"]);
        newDeath.push(filteredData[i]["new_deaths"]);
        accCase.push(filteredData[i]["total_cases"]);
        accDeath.push(filteredData[i]["total_deaths"]);
    }

    var trace1 = {
        x: dateAxis,
        y: newCase,
        type: 'scatter',
        name: "Cases"
    };
    
    var trace2 = {
        x: dateAxis,
        y: newDeath,
        type: 'scatter',
        yaxis: 'y2',
        name: "Deaths",
        marker: {
            color: "#DA0037"
        }
    };
    
    var data = [trace1, trace2];
    var layout = {
        yaxis: {
            title: 'Number of cases',
            showgrid: false
        },
        yaxis2: {
          title: 'Number of deaths',
          overlaying: 'y',
          side: 'right',
          showgrid: false
        },
        xaxis: {
            showgrid: false
        },
        paper_bgcolor: "#171717",
        plot_bgcolor: "#171717",
        font: {
            color:"white",
            family: "Overpass",
            size: 15
        },
        legend: {
            "orientation": "h",
            x: 0.5
        },
        margin: {"t": 0}
      };
      
    Plotly.newPlot('lineChart', data, layout);
      
    
}

function isKeyAllowed(key) {
  return ["rank", "Country", "Continent", "TotalCases", "TotalDeaths", "TotalRecovered", "ActiveCases", "Infection_Risk"].includes(key);

}

function generateTable(data, selectedCountry, tableId) {
  // Create the element table 
  var table = document.createElement("table");
  // Create the header of the table
  var header = table.createTHead();
  // Create a row for the header
  var headerRow = header.insertRow();
  // Append the name of the column to the header
  for (var key in data[0]) {
      // console.log(key);
      if (isKeyAllowed(key)) {
          // Create th tag to row of header
          var headerCell = document.createElement("th");
          // Include the name of column to the cell
          // Here we can change the name of the column if we need to by replacing "key" variable
          var nameColumn = key;
          if (nameColumn === "rank"){
              nameColumn = "Global Rank";
          }
          else if (nameColumn === "TotalCases") {
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

  // Filter Japan only
  var list = data.filter(country => country.Country === selectedCountry);
  for (var indexRow = 0; indexRow < list.length; indexRow++) {
      // Create each row
      var row = table.insertRow();
      for (var key in list[indexRow]) {
          if (isKeyAllowed(key)) {
              var valueCell = list[indexRow][key];
              // Create a cell
              var cell = row.insertCell();
              // Include the value in the cell for a column
              cell.innerHTML = valueCell;
              // console.log(key);
          }
      }
  }
  document.getElementById(tableId).appendChild(table);
}

let countryName = document.querySelector("#country-name").getAttribute("data-country");
let countrySymbol = document.querySelector("#country-name").getAttribute("data-symbol");
plotHistorical(history, countrySymbol);
generateTable(covidJson, countryName, "covidTable");