/*
 *** Initialize map variables & load initial JS files
 */
function loadInitialMapData(error, nationData, eraData, eventData, characterData, cityData){
    nationTable = nationData;
    eraTable = eraData;
    eventTable = eventData;
    characterTable = characterData;
    cityTable = cityData;
    updateEraDate();
    updateEraName();
    updateEraSummary();
    updateCharacters(0);


    queue()
        .defer(d3.json, "data/" + getJsonFilename(-1) + ".json")
        .defer(d3.json, "data/" + getJsonFilename(0) + ".json")
        .defer(d3.json, "data/" + getJsonFilename(1) + ".json")
        .await(initializeD3Map);

    initializeCities();
}




/*
 *** Draw map on screen for first time
 */
function initializeD3Map(error, previousMapData, currentMapData, nextMapData) {

    previousEraBoundaries = homogenizeNodeCount(previousMapData.features, 0);
    presentEraBoundaries = homogenizeNodeCount(currentMapData.features, 0);
    nextEraBoundaries = homogenizeNodeCount(nextMapData.features, 0);

    currentEraBoundaries = homogenizeNodeCount(currentMapData.features, 0);

    // Render map
    regionMap.selectAll("path")
        .data(currentEraBoundaries)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d){ return "region" + d.id;})
        .attr("class", function(d){return "primaryMapRegion " + nationTable[d.id].culture})
        .on("mouseover", function(d){
            d3.select(this).style("opacity", "0.7");
        })
        .on("mouseout", function(d){
            d3.select(this).style("opacity", "0.5");
        })
        .on("click", function(d){updateRegionStats(d);});


    d3.select("#primaryMap")
        .on("click", function(){
            if(d3.event.path[0].id == "primaryMap"){
                updateRegionStats(-1);
            }
        });
        //.call(primaryMapDrag);


    labelRegions(0);
    calculateRegionAreas();


    queue()
        .defer(loadAudio)
        .await(startPage);
}



function initializeCities(){
    // add circles to svg
    cityMap.selectAll("circle")
        .data(cityTable).enter()
        .append("circle")
        .attr("id", function(d){ return "city"+ d.id; })
        .attr("class", "city")
        .attr("cx", function (d) {
            return projection(d.location.split(",").reverse())[0];
        })
        .attr("cy", function (d) {
            return projection(d.location.split(",").reverse())[1]; })
        .attr("r", function (d){
            if(d["e"+currentEra] > 0){
                return calculateCityRadius(d["e"+currentEra]) + "px";
            } else {
                return "0";
            }
        })
        .attr("fill", "black")
        .on("mouseover", function(d){
            d3.select(this).style("opacity", "0.9");
        })
        .on("mouseout", function(d){
            d3.select(this).style("opacity", "0.5");
        })
        .on("click", function(d, i){
            var cityId = d.id;
            d3.select("#detailsWindowCloseButton").attr("eventId", "city"+cityId);
            d3.select("#detailsWindowImage")
                .style("height", "0")
                .style("border", "0")
                .style("background-image", "none");
            d3.select("#detailsWindowTitle").html("");
            d3.select("#detailsWindowSubTitle").html(cityTable[cityId].name);
            d3.select("#detailsWindowDescription").html(cityTable[cityId].summary);
            d3.select("#detailsWindowGoToRegion").attr("location", cityTable[cityId].location);
            $('#detailsModal').modal('show');
        });

    labelCities(eraChangeDuration);
}



/*
 *** Load audio files
 */
function loadAudio(callback) {
    backgroundMusic = new Audio('audio/backgroundMusic.mp3'); // https://www.youtube.com/watch?v=u01Dk8O53JQ
    backgroundMusic.loop = true;
    nextEraAudio = new Audio('audio/nextEra.mp3'); // https://www.youtube.com/watch?v=aEaniKgfRRY
    eventBattleAudio = new Audio('audio/eventBattle.mp3'); // https://www.youtube.com/watch?v=rhFkafqZj58
    eventConquerAudio = new Audio('audio/eventConquer.mp3'); // https://www.youtube.com/watch?v=JSNlNMnsPn0
    eventExecutionAudio = new Audio('audio/eventExecution.wav'); // https://www.youtube.com/watch?v=-9tI2GcRf6c
    eventFireAudio = new Audio('audio/eventFire.wav'); // https://www.youtube.com/watch?v=dRilRgvJ0-k
    eventIndependenceAudio = new Audio('audio/eventIndependence.wav'); // https://www.youtube.com/watch?v=tq-Bp_2FOGA

    callback(null);
}




/*
 *** Trigger the intro splashscreen & begin playing background music
 */
function startPage(error){
    toggleEraSummaryBox();
    toggleCharacterSummaryBox();
    d3.select("#loadScreen")
        .transition()
        .duration(5000)
        .style("opacity", "0");
    backgroundMusic.play();
    setTimeout(function(){
        d3.select("#loadScreen").remove();
        $('#trainingModal').modal('show');
    }, 4000);
}




/*
 *** Load the Google map
 */
function initializeGoogleMap() {
    var mapProp = {
        center:new google.maps.LatLng(30,0),
        zoom: currentZoom + zoomConversionGoogle,
        mapTypeId:google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    };
    googleMap=new google.maps.Map(document.getElementById("primaryMapColumn"),mapProp);
}




/*
 *** Draw MiniMap for the first time
 */
function initializeMiniMap(error, mapData) {

    // Convert TopoJSON to GeoJSON (target object = 'countries')
    var world = topojson.feature(mapData, mapData.objects.countries).features;

    // Render map
    miniMap.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", miniMapBase)
        .attr("class", "country");

    //Render View Box
    miniMapSizeConversion = miniProjection.scale()/projection.scale();

    viewBox = miniMap.append("rect")
        .attr("id", "viewBox")
        .attr("x", miniProjection(projection.center())[0] - primaryMapWidth * miniMapSizeConversion/2)
        .attr("y", miniProjection(projection.center())[1] - primaryMapHeight * miniMapSizeConversion/2)
        .attr("width", primaryMapWidth * miniMapSizeConversion)
        .attr("height", primaryMapHeight * miniMapSizeConversion)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "none")
        .call(viewBoxDrag);

}

var trainingPage = 0;
$("#trainingWindowNext")
    .on("mouseover", function(){
        d3.select(this)
        .style("border-radius", "50%")
        .style("box-shadow", "0 0 5px #fff");
    })
    .on("mouseout", function(){ d3.select(this).style("box-shadow", "0 0 0 #fff"); })
    .click(function(){
        switch(trainingPage){
            case 0: $("#trainingWindowTitle").text("Navigation");
                    $("#trainingWindowText").html("<p>Zoom in and out with your mouse wheel.</p><p>Pan the map by moving your mouse to the edge of the screen or using your keyboard arrow keys.</p><p>Click and drag the red box in the mini map to go directly to a location.</p>");
                    trainingPage++;
                    break;
            case 1: $("#trainingWindowTitle").text("Time Machine");
                    $("#trainingWindowText").html("<p>The hallmark of Tide of Nations is its display of changes in the world over time. Use the arrow buttons at the bottom-right of the screen to move forward or backward in time.</p><p>As you move from one year to the next, event boxes will fall at the left of the screen to reveal important events that occurred in the interim.</p>");
                    trainingPage++;
                    break;
            case 2: $("#trainingWindowTitle").text("Dive Deeper");
                    $("#trainingWindowText").html("<p>Click on the nations on the map, the character portraits, or the event boxes for more details about that item.</p>");
                    trainingPage++;
                    break;
            case 3: $("#trainingWindowTitle").text("Focus");
                    $("#trainingWindowText").html("<p>Click the tabs on the informational boxes at the bottom and right of the map to hide them if you want more map space.</p>");
                    $("#trainingWindowNextText").text("Begin");
                    trainingPage++;
                    break;
            case 4: $('#trainingModal').modal('hide');
            default: break;
        }
    });


$("#trainingWindowCloseButton")
    .on("mouseover", function(){
        d3.select(this)
            .style("border-radius", "50%")
            .style("box-shadow", "0 0 5px #fff");
    })
    .on("mouseout", function(){ d3.select(this).style("box-shadow", "0 0 0 #fff"); })
    .click(function(){ $('#trainingModal').modal('hide'); });