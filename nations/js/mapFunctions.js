/*
 *** Load the next JSON file for lazy loading
 */
function getJsonFilename(direction){
    console.log(currentEra);
    switch(direction){
        case -1: if(currentEra <= 0){
            return eraTable[0].filename;
        } else {
            return eraTable[currentEra-1].filename;
        }
            break;
        case 0: return eraTable[currentEra].filename;
            break;
        case 1: if(currentEra >= eraTable.length-1){
            return eraTable[eraTable.length-1].filename;
        } else {
            return eraTable[currentEra+1].filename;
        }
            break;
        default: return eraTable[currentEra].filename;
    }
}




/*
 *** Increase the number of a nations Lat/Long nodes to a set value to avoid animation artifacts
 */
function homogenizeNodeCount(mapData){

    var homogenizedMapData = mapData;

    for(var region = 0; region < mapData.length; region++){
        var regionData;
        if(currentEra < 5){
            regionData = mapData[region].geometry.coordinates[0];
        } else {
            regionData = mapData[region].geometry.coordinates[0].reverse();
        }
        var currentRegionNodeNumber = regionData.length;
        var targetRegionNodeNumber = nationTable[mapData[region].id].nodes;
        var homogenizedRegionData = regionData;
        if(targetRegionNodeNumber > currentRegionNodeNumber){
            var startingNode = regionData = mapData[region].geometry.coordinates[0][0];
            for(var node = 0; node < targetRegionNodeNumber - currentRegionNodeNumber; node++){
                homogenizedRegionData.push(startingNode);
            }
            homogenizedMapData[region].geometry.coordinates[0] = homogenizedRegionData;
        }
    }

    return homogenizedMapData;
}




/*
 *** Add Labels to the nations on the map, adjusting font size according to the size of the nation
 */
function labelRegions(duration){

    // Data Join
    var currentLabels = primaryMap.selectAll(".regionLabel")
        .data(currentEraBoundaries);

    currentLabels
        .enter().append("text")
        .attr("class", "regionLabel");

    currentLabels
        .attr("id", function(d){ return "label" + d.id;})
        .text(function(d){ return nationTable[d.id].name; })
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            var textWidth = d3.select("#label"+ d.id)[0][0].clientWidth;
            return "translate(" + (path.centroid(d)[0]-textWidth/2) + "," + path.centroid(d)[1] + ")";
        })
        .attr("font-size", function(d){
            var regionArea = path.area(d);
            var fontSize = Math.floor(Math.log(regionArea))*2;
            if(path.area(d) > 0 && fontSize >= (fontThreshold)){
                return (Math.floor(Math.log(regionArea))*2) + "px";
            } else {
                return "0";
            }
        });

    currentLabels.exit().remove();
}




/*
 *** Move the nation map as the Google map is moved
 */
function updateMap(duration){
    primaryMap.selectAll("path")
        .transition()
        .duration(duration)
        .attr("d", path);
    labelRegions(duration);
}