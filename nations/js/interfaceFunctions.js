/*
 *** Update stat box when a nation is clicked
 */
function updateRegionStats(d){
    if(d == -1){
        d3.select("#selectedRegionName").attr("regionId", -1);
        d3.select("#selectedRegionName").text("");
        d3.select("#selectedRegionStats").html("");
        d3.select("#selectedRegionDescription").html("");
    } else if(d == 0){
        var regionId = d3.select("#selectedRegionName").attr("regionId");
        if(regionId > -1){
            d3.select("#selectedRegionName").text(nationTable[regionId].name);
            d3.select("#selectedRegionStats").html("<li>Culture: " + nationTable[regionId].culture.charAt(0).toUpperCase() + nationTable[regionId].culture.slice(1) + "</li><li>Religion: " + nationTable[regionId].religion + "</li><li>Eras in Existence: " + (currentEra - nationTable[regionId].yearFounded) + "</li>");
            d3.select("#selectedRegionDescription").html(nationTable[regionId].description);
        }
    } else {
        d3.select("#selectedRegionName").attr("regionId", d.id);
        d3.select("#selectedRegionName").text(nationTable[d.id].name);
        d3.select("#selectedRegionStats").html("<li>Culture: " + nationTable[d.id].culture.charAt(0).toUpperCase() + nationTable[d.id].culture.slice(1) + "</li><li>Religion: " + nationTable[d.id].religion + "</li><li>Eras in Existence: " + (currentEra - nationTable[d.id].yearFounded) + "</li>");
        d3.select("#selectedRegionDescription").html(nationTable[d.id].description);
    }
}




/*
 *** Zoom in or out of the map
 */
function zoom(direction) {

    if(direction > 0 && currentZoom < 2){
        currentZoom++;
        projection.scale(Math.pow(2, currentZoom) * zoomConversionD3);
        googleMap.setZoom(currentZoom + zoomConversionGoogle);
    }
    if(direction < 0 && currentZoom > 0){
        currentZoom--;
        projection.scale(Math.pow(2, currentZoom) * zoomConversionD3);
        googleMap.setZoom(currentZoom + zoomConversionGoogle);
    }

    // Redraw map
    updateMap(zoomInterval);

    //Redraw minimap viewbox
    miniMapSizeConversion = miniProjection.scale()/projection.scale();
    viewBox
        .transition()
        .duration(500)
        .attr("x", miniProjection(projection.center())[0] - primaryMapWidth * miniMapSizeConversion/2)
        .attr("y", miniProjection(projection.center())[1] - primaryMapHeight * miniMapSizeConversion/2)
        .attr("width", primaryMapWidth * miniMapSizeConversion)
        .attr("height", primaryMapHeight * miniMapSizeConversion);


    if(currentZoom == 0){
        projection.center([0,30]);
        googleMap.setCenter({lat: 30, lng: 0});
        updateMap(0);

        // Disable primary map navigation
        d3.selectAll(".panTrigger")
            .classed("hidden", true);

        // Disable minimap viewbox
        viewBox
            .attr("fill", "none")
            .attr("stroke", "none");
    } else {
        // Update Travel speed
        travelSpeed = Math.floor(baseTravelSpeed / currentZoom);

        // Enable primary map navigation
        d3.selectAll(".panTrigger")
            .classed("hidden", false);

        // Enable minimap viewbox navigation
        viewBox
            .attr("fill", "rgba(255,240,240,.1)")
            .attr("stroke", "rgba(255,0,0,1)");
    }
}




/**
 *** Move both the Google Map and the D3 map when a travel trigger is received
 **/
function travel(direction){
    // Get current map center coordinates
    var pCenter = projection.center();

    // Calculate new map center coordinates & update D3 projection & Google Map position
    switch(direction){
        case 0: if(pCenter[1] < 70) {
            projection.center([pCenter[0], pCenter[1] + travelSpeed]);
            googleMap.setCenter({lat: pCenter[1] + travelSpeed, lng: pCenter[0]});
        }
            break;
        case 1: if(pCenter[0] < 180) {
            projection.center([pCenter[0]+travelSpeed,pCenter[1]]);
            googleMap.setCenter({lat: pCenter[1], lng: pCenter[0]+travelSpeed});
        }
            break;
        case 2: if(pCenter[1] > -70) {
            projection.center([pCenter[0], pCenter[1] - travelSpeed]);
            googleMap.setCenter({lat: pCenter[1] - travelSpeed, lng: pCenter[0]});
        }
            break;
        case 3: if(pCenter[0] > -180) {
            projection.center([pCenter[0] - travelSpeed, pCenter[1]]);
            googleMap.setCenter({lat: pCenter[1], lng: pCenter[0] - travelSpeed});
        }
            break;
    }

    // Update D3 map position
    updateMap(0);
    updateMiniMap();
}

//Redraw minimap viewbox
function updateMiniMap() {
    miniMapSizeConversion = miniProjection.scale()/projection.scale();
    viewBox
        .attr("x", miniProjection(projection.center())[0] - primaryMapWidth * miniMapSizeConversion/2)
        .attr("y", miniProjection(projection.center())[1] - primaryMapHeight * miniMapSizeConversion/2)
        .attr("width", primaryMapWidth * miniMapSizeConversion)
        .attr("height", primaryMapHeight * miniMapSizeConversion);
}




/*
 *** Move both the Google Map and the D3 map when when panned
 */
function primaryMapPan() {

    /*
    projection of origin
    projection of current

    */

    console.log(getPrimaryMapPanDeltaX(d3.event.x) + ", " + getPrimaryMapPanDeltaY(d3.event.y));
    var pCenter = projection.invert([getPrimaryMapPanDeltaX(d3.event.x), getPrimaryMapPanDeltaY(d3.event.y)]);
    primaryMapPanOrigin = [d3.event.x, d3.event.y];
    //var vCenter = projection.invert([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
    //var vCenter = projection.invert([longitude, latitude]);
   //console.log(vCenter);

    var pCenter = projection.center();

    projection.center([pCenter[0]+travelSpeed,pCenter[1]]);

    googleMap.setCenter({lat: pCenter[1], lng: pCenter[0]});

    updateMap(0);
    updateMiniMap();
}




/*
 *** Get the delta X of the current pan
 */
function getPrimaryMapPanDeltaX(panX) {
    return projection(projection.center())[0] - (panX - primaryMapPanOrigin[0]);
}


/*
 *** Get the delta Y of the current pan
 */
function getPrimaryMapPanDeltaY(panY) {
    return projection(projection.center())[1] - (panY - primaryMapPanOrigin[1]);
}




/*
 *** Set the origin of the map pan action
 */
function setPrimaryMapPanOrigin() {
    primaryMapPanOrigin = [d3.event.sourceEvent.x, d3.event.sourceEvent.y];
    console.log(primaryMapPanOrigin);

    //var vCenter = projection.invert([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
    //console.log(vCenter);
    //console.log(projection.center());
    //projection.center(vCenter);
    //updateMap(0);
}






/*
 *** Move the minimap view box when dragged
 */
function viewBoxDragBehavior() {

    d3.select(this)
        .attr("x", d3.event.x - viewBox.attr("width")/2)
        .attr("y", d3.event.y - viewBox.attr("height")/2);
}




/*
 *** Update the main map when the minimap view box is released
 */
function viewBoxDragRelease() {
    var vCenter = miniProjection.invert([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
    // Update Primary Map
    projection.center(vCenter);
    googleMap.setCenter({lat: vCenter[1], lng: vCenter[0]});
    // Update D3 map position
    updateMap(0);
}




/*
 *** Open or hide the era text summary box
 */
function toggleEraSummaryBox(){
    if(eraSummaryBoxOpen){
        eraSummaryBox
            .transition()
            .duration(1500)
            .style("top", primaryMapHeight + "px");
        setTimeout(function(){eraSummaryBoxToggle.html("<span class='glyphicon glyphicon-chevron-up'></span>");}, 1500);
        eraSummaryBoxOpen = false;
    } else {
        eraSummaryBox
            .transition()
            .duration(1500)
            .style("top", (primaryMapHeight - eraSummaryBoxHeight) + "px");
        setTimeout(function(){eraSummaryBoxToggle.html("<span class='glyphicon glyphicon-chevron-down'></span>");}, 1500);
        eraSummaryBoxOpen = true;
    }
}




/*
 *** Open or hide the character summary box
 */
function toggleCharacterSummaryBox(){
    if(characterSummaryBoxOpen){
        characterSummaryBox
            .transition()
            .duration(1500)
            .style("left", primaryMapWidth-5 + "px");
        setTimeout(function(){characterSummaryBoxToggle.html("<span class='glyphicon glyphicon-chevron-left'></span>");}, 1500);
        characterSummaryBoxOpen = false;
    } else {
        characterSummaryBox
            .transition()
            .duration(1500)
            .style("left", (primaryMapWidth - characterSummaryBoxWidth) + "px");
        setTimeout(function(){characterSummaryBoxToggle.html("<span class='glyphicon glyphicon-chevron-right'></span>");}, 1500);
        characterSummaryBoxOpen = true;
    }
}





function toggleSound() {
    if(backgroundMusic.paused == true){
        backgroundMusic.play();
        d3.select("#mute").attr("src", "img/audio.png");
    } else {
        backgroundMusic.pause();
        d3.select("#mute").attr("src", "img/audioMute.png");
    }
}




$("body").keydown(function(event){
    switch(event.which){
        case 38: travel(0);
                 break;
        case 39: travel(1);
            break;
        case 40: travel(2);
            break;
        case 37: travel(3);
            break;
        default: break;
    }
});