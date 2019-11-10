'use strict';

const apiKey = "EjmUnVH3acYX1c6uGlxYfEsA3wU6ZMVCQKSbIYCZ";

const npsParksURL = "https://developer.nps.gov/api/v1/parks";

//National Park Service API doesn't return error messages for blank or wrong stateCode values
//blank value returns random national parks
//wrong value returns {"total": "0","data": [],"limit": "10"}
//"q" parameter only bring's back term's found in "description": & NOT all national parks in state

//Need to validate user input if no error messages are popping up from the API
//stateCode requires a state's abbreviation and returns national parks for the state
let foundStates = [];

function stateAbbreviations(userInput) {
    foundStates = [];
    let states = userInput.toUpperCase().trim().split(/[, ]+/);
    console.log(states); //['AZ','HI']
    for (let i = 0; i < states.length; i++) {
        if (states[i] === 'AL'|| states[i] === 'AK' || states[i] === 'AZ' || states[i] === 'AR' || states[i] === 'CA' || states[i] === 'CO' || states[i] === 'CT' || states[i] === 'DE' || states[i] === 'FL' || states[i] === 'GA' || states[i] === 'HI' || states[i] === 'ID' || states[i] === 'IL' || states[i] === 'IN' || states[i] === 'IA' || states[i] === 'KS' || states[i] === 'KY' || states[i] === 'LA' || states[i] === 'ME' || states[i] === 'MD' || states[i] === 'MA' || states[i] === 'MI' || states[i] === 'MN' || states[i] === 'MS' || states[i] === 'MO' || states[i] === 'MT' || states[i] === 'NE' || states[i] === 'NV' || states[i] === 'NH' || states[i] === 'NJ' || states[i] === 'NM' || states[i] === 'NY' || states[i] === 'NC' || states[i] === 'ND' || states[i] === 'OH' || states[i] === 'OK' || states[i] === 'OR' || states[i] === 'PA' || states[i] === 'RI' || states[i] === 'SC' || states[i] === 'SD' || states[i] === 'TN' || states[i] === 'TX' || states[i] === 'UT' || states[i] === 'VT' || states[i] === 'VA' || states[i] === 'WA' || states[i] === 'WV' || states[i] === 'WI' || states[i] === 'WY' || states[i] === 'AS' || states[i] === 'DC' || states[i] === 'PR' || states[i] === 'MP' || states[i] === 'VI') {
            
            $(".error-message").empty();
            foundStates.push(states[i]);
        
        } else {

            console.log(foundStates);
            return $(".error-message").text(`Sorry, please make sure to enter the correct state abbreviations. Here are some parks.`);

        };
    };

    console.log(foundStates);
    return foundStates;
};

function formatQueryParams(params) {
    //params keys are put in an array equal to their values
    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`);
    //return array as string
    return queryItems.join("&");
};

const findAddress = 'addresses';

function getNationalParks(foundStates, limit=10) {

    const params = {
        stateCode: foundStates.join(","),
        fields: findAddress,
        limit, //default is 10
        api_key: apiKey
    };
    
    const queryString = formatQueryParams(params);
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
            <h2>${searchData[i].fullName}</h2>
            <h3>${searchData[i].addresses[0].city}, ${searchData[i].addresses[0].stateCode}</h3>
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
        
        getNationalParks(foundStates, limit);
                
    });
};


$(findParksInState);