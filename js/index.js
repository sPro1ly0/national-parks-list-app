'use strict';

const apiKey = "EjmUnVH3acYX1c6uGlxYfEsA3wU6ZMVCQKSbIYCZ";

const npsParksURL = "https://developer.nps.gov/api/v1/parks";

//National Park Service API doesn't return error messages for blank or wrong stateCode values
//blank value returns random national parks
//wrong value returns {"total": "0","data": [],"limit": "10"}
//"q" parameter only bring's back term's found in "description": & NOT all national parks in state

//Need to validate user input if no error messages are popping up from the API
//stateCode requires a state's abbreviation and returns national parks for the state
let stateAbb = null;

function stateAbbreviations(userInput) {

    //console.log(userInput); Alabama or AL
    let upCaseInput = userInput.toUpperCase();

    //capitalize input value and find it in stateSTORE array of objects
    stateAbb = stateSTORE.find( name => name['state'] === upCaseInput || name['ab'] === upCaseInput);
    
    //console.log(stateAbb); {state: "ALABAMA", ab: "AL"}
    if (typeof stateAbb === "undefined") { //if input value not found in stateSTORE

        return $(".error-message").text(`No results for "${userInput}". Please enter a state.`);
    
    } else if (stateAbb != "undefined") { //if found let statAbb equal state's abbreviation
        
        $(".error-message").empty();
        return stateAbb = stateAbb['ab'];
    };

};

function createGetRequest(params) {
    //params keys are put in an array equal to their values
    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`);
    //return array as string
    return queryItems.join("&");
};

function getNationalParks(stateAbb, limit=10) {
    
    const params = {
        stateCode: stateAbb,
        limit, //default is 10
        api_key: apiKey
    };

    const queryString = createGetRequest(params);
    const url = npsParksURL + "?" + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $(".error-message").text(`${error.message} information from server.`);
        });

};

function displayResults(responseJson) {
    //display a list of national parks in an area

    let searchData = responseJson.data;
    console.log(searchData);

    $(".result-list").empty();

    for (let i = 0; i < searchData.length; i++) {
        $(".result-list").append(`
        <li>
            <h2>${searchData[i].name}</h2>
            <p>${searchData[i].description}</p>
            <a href="${searchData[i].url}">${searchData[i].url}</a>
        </li>
        `);
    };

    $(".results").removeClass("hidden");

};

function findParksInState() {
    $("form").submit(event => {
        event.preventDefault();
        const userInput = $("#states").val();
        stateAbbreviations(userInput); //validate user input value
        const limit = $("#max-number").val();
        getNationalParks(stateAbb, limit);
    });
};


$(findParksInState);