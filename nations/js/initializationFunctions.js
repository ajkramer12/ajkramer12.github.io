/*
 *** Initialize map variables & load initial JS files
 */
function loadInitialMapData(error, nationData, eraData, eventData, characterData){
    nationTable = nationData;
    eraTable = eraData;
    eventTable = eventData;
    characterTable = characterData;
    updateEraDate();
    updateEraName();
    updateEraSummary();
    updateCharacters();


    queue()
        .defer(d3.json, "data/" + getJsonFilename(-1) + ".json")
        .defer(d3.json, "data/" + getJsonFilename(0) + ".json")
        .defer(d3.json, "data/" + getJsonFilename(1) + ".json")
        .await(initializeD3Map);
}




/*
 *** Draw map on screen for first time
 */
function initializeD3Map(error, previousMapData, currentMapData, nextMapData) {

    previousEraBoundaries = homogenizeNodeCount(previousMapData.features);
    presentEraBoundaries = homogenizeNodeCount(currentMapData.features);
    nextEraBoundaries = homogenizeNodeCount(nextMapData.features);

    currentEraBoundaries = homogenizeNodeCount(currentMapData.features);

    // Render map
    primaryMap.selectAll("path")
        .data(currentEraBoundaries)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d){ return "region" + d.id;})
        .attr("class", function(d){return "primaryMapRegion " + nationTable[d.id].culture})
        .on("click", function(d){updateRegionStats(d);});

    d3.select("#primaryMap")
        .on("click", function(){
            if(d3.event.path[0].id == "primaryMap"){
                updateRegionStats(-1);
            }
        });

    labelRegions(0);
    calculateRegionAreas();


    queue()
        .defer(loadAudio)
        .await(startPage);
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

