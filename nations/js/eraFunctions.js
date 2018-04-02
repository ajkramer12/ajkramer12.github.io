/*
 *** Trigger the cascade of events necessary to update an era
 */
function updateEra(current, goal){
    nextEraAudio.play();

    if(goal >= 0 && goal <= eraTable.length-1) {
        var direction = 0;

        if(current <= goal){
            direction = 1;
            updateEraMap(currentEraBoundaries, nextEraBoundaries);
        } else {
            direction = -1;
            updateEraMap(currentEraBoundaries, previousEraBoundaries);
        }

        setTimeout(calculateRegionAreas, eraChangeDuration);

        currentEra = goal;

        queue()
            .defer(d3.json, "data/" + getJsonFilename(direction) + ".json")
            .await(updateEraMapWrapup(direction));

        updateEraDate();
        updateEraName();
        updateEraSummary();
        updateRegionStats(0);
        updateCities(eraChangeDuration);
        updateCharacters();
        triggerEvents();

    }

}



/*
 *** Trigger lazy loading of boundary files in preparation for the next era update
 */
function updateEraMapWrapup(direction) {
    return function(error, newData) {
        if(direction < 0){
            nextEraBoundaries = presentEraBoundaries;
            presentEraBoundaries = previousEraBoundaries;

            previousEraBoundaries = newData;
            //previousEraBoundaries = homogenizeNodeCount(previousEraBoundaries.features);
            previousEraBoundaries = previousEraBoundaries.features;
        } else {
            previousEraBoundaries = presentEraBoundaries;
            presentEraBoundaries = nextEraBoundaries;

            nextEraBoundaries = newData;
            nextEraBoundaries = homogenizeNodeCount(nextEraBoundaries.features);
            //nextEraBoundaries = nextEraBoundaries.features;
        }
        console.log(currentEra);
        console.log(previousEraBoundaries.length);
        console.log(presentEraBoundaries.length);
        console.log(nextEraBoundaries.length);
        console.log("\n"+currentEraBoundaries.length);

    };
}




/*
 *** Update the date to display the new era
 */
function updateEraDate(){
    eraDateSpan.text(eraTable[currentEra].date);
}




/*
 *** Load the period name of the new era
 */
function updateEraName(){
    d3.select("#grandEraLabel").text(eraTable[currentEra].eraname)
}




/*
 *** Load the new era's text summary
 */
function updateEraSummary(){
    d3.select("#eraSummary").html(eraTable[currentEra].summary);
}




/*
 *** Redraw the nation map with the new era's boundaries
 */
function updateEraMap(currentBoundaries, goalBoundaries){
    var i, j;
    var found = false;

    for(i=0; i < currentBoundaries.length; i++){
        for(j=0; j < goalBoundaries.length && !found; j++){
            if(currentBoundaries[i].id == goalBoundaries[j].id){

                /* This won't work here because the data is already homogenized, but I need it to work somewhere to test
                 ** for conquered nations.

                 if(nextEraBoundaries[j].geometry.coordinates[0].length == 3){
                 d3.select("#region"+currentBoundaries[i].id)
                 .classed("conquered", true);
                 }
                 */
                if(currentBoundaries[i].id == 49){
                    console.log("Coor");
                    console.log(currentBoundaries[i].geometry.coordinates[0]);
                    console.log(goalBoundaries[j].geometry.coordinates[0]);
                    console.log("end");
                }
                currentBoundaries[i].geometry.coordinates[0] = goalBoundaries[j].geometry.coordinates[0];
                found = true;
            }
        }
        if(!found){
            d3.select("#region"+currentBoundaries[i].id)
                //.classed("transitioned", true)
                .transition()
                .duration(eraChangeDuration)
                .style("opacity", 0);
        }
        found = false;
    }

    for(i=0; i < goalBoundaries.length; i++){
        for(j=0; j < currentBoundaries.length && !found; j++){
            if(goalBoundaries[i].id == currentBoundaries[j].id){
                found = true;
            }
        }
        if(!found){
            currentBoundaries.push(goalBoundaries[i]);
            primaryMap.selectAll("path")
                .data(currentBoundaries)
                .enter().append("path")
                .attr("d", path)
                .attr("id", function(d){ return "region" + d.id;})
                .attr("class", function(d){return "primaryMapRegion " + nationTable[d.id].culture})
                .style("opacity", 0)
                .on("click", function(d){updateRegionStats(d);});
        }
        found = false;
    }

    console.log(currentBoundaries);

    // Redraw map
    primaryMap.selectAll("path:not(.transitioned)")
        .transition()
        .duration(eraChangeDuration)
        .attr("d", path)
        .style("opacity", 0.5);
    labelRegions(eraChangeDuration);

}




/*
 *** Clear past era's events and display the new era's events
 */
function triggerEvents(){
    d3.selectAll(".eventNotification").remove();

    var eventCount = 0;
    var boxCount = [0,0];

    for(var i = 0; i < eventTable.length && eventTable[i].era <= currentEra; i++){
        if(eventTable[i].era == currentEra){
            eventCount++;
            boxCount[eventTable[i].col]++;
            var eventData = eventTable[i];
            var event = d3.select("#pageContainer").append("div")
                .attr("id", function(){ return "event" + eventData.id;})
                .attr("class", function(){return "eventNotification " + eventData.type + "event " + "eventCount" + eventCount;})
                .style("height", "8vh")
                .style("width", "8vh")
                .style("top", function(){return primaryMapHeight/-10 + "px";})
                .style("left", function(){return (eventTable[i].col*8.5 + 0.5) + "vh"})
                .style("background-image", "url(img/event"+eventTable[i].type+".jpg)")
                /*
                 * battle: http://cdn.pcwallart.com/images/fantasy-medieval-battle-art-wallpaper-3.jpg
                 * coalition: http://alison-morton.com/wp-content/uploads/2015/04/Roman-handshake.jpg
                 * conquer: http://img09.deviantart.net/74a0/i/2014/241/c/f/sword_in_the_ground_by_taaks-d7x3gms.jpg
                 * independence: http://kaposiadays.org/wp-content/uploads/fireworks-file1.jpg
                 * resurface: http://www.phoenixtradingstrategies.com/wp-content/uploads/2014/09/Phoenix.jpg
                 * vassal: http://awoiaf.westeros.org/images/thumb/6/69/Davos_Kneeling_King_Stannis.jpg/350px-Davos_Kneeling_King_Stannis.jpg
                 * war: http://us.123rf.com/450wm/andreykuzmin/andreykuzmin1502/andreykuzmin150200118/37177744-medieval-knight-shield-and-crossed-swords-on-wooden-gate.jpg?ver=6
                 * */
                .style("background-size", "contain")
                .on("click", function(d, i){
                    var eventId = d3.event.srcElement.id.slice(5);
                    d3.select("#detailsWindowCloseButton").attr("eventId", "event"+eventId);
                    if(eventTable[eventId].image != "NULL") {
                        d3.select("#detailsWindowImage")
                            .style("height", "30vh")
                            .style("border", "3px groove #333333")
                            .style("background-image", "url(img/"+eventTable[eventId].image+")");
                    } else {
                        d3.select("#detailsWindowImage")
                            .style("height", "0")
                            .style("border", "0")
                            .style("background-image", "none");
                    }
                    d3.select("#detailsWindowTitle").html(eventTable[eventId].title);
                    d3.select("#detailsWindowSubTitle").html(eventTable[eventId].subTitle);
                    d3.select("#detailsWindowDescription").html(eventTable[eventId].description);
                    $('#detailsModal').modal('show');
                    switch (eventTable[eventId].type) {
                        case "Battle":
                            eventBattleAudio.play();
                            break;
                        case "Conquer":
                            eventConquerAudio.play();
                            break;
                        case "Execution":
                            eventExecutionAudio.play();
                            break;
                        case "Destruction":
                            eventFireAudio.play();
                            break;
                        case "Independence":
                            eventIndependenceAudio.play();
                            break;
                        default:
                            break;
                    }
                    /*if(eventTable[eventId].type == "Battle"){
                        eventBattleAudio.play();
                    } else if(eventTable[eventId].type == "Conquer") {
                        eventConquerAudio.play();
                    } else if(eventTable[eventId].type == "Execution") {
                        eventExecutionAudio.play();
                    } else if(eventTable[eventId].type == "Destruction") {
                        eventFireAudio.play();
                    } else if(eventTable[eventId].type == "Independence") {
                        eventIndependenceAudio.play();
                    }*/
                    d3.select("#detailsWindowGoToRegion").attr("location", eventTable[eventId].location);
                });
            event
                .transition()
                .delay((eventCount-1)*(eraChangeDuration/10))
                .duration(eraChangeDuration/1.5)
                .ease("linear")
                .style("top", function(){
                    return (80 - 8*boxCount[eventTable[i].col])+"vh"
                });
        }
    }


    var events = d3.selectAll(".eventNotification")[0];
}




/*
 *** Update character box for the new era
 */
function updateCharacters(){

    for(var i = 0; i < characterTable.length && characterTable[i].startEra <= currentEra; i++) {
        var characterData = characterTable[i];
        var character;

        if (characterTable[i].endEra == currentEra) {
            var killedCharacter = d3.select("#character" + characterData.id)
                .transition()
                .duration(500)
                .ease("linear")
                .style("height", "1px")
                .style("width", "1px")
                .style("opacity", "0");
            setTimeout(function(){killedCharacter.remove();}, 500);

        }
        if (characterTable[i].startEra == currentEra) {
            var addedCharacter = d3.select("#characterSummaryContainer").append("div")
                .attr("id", function(){ return "character" + characterData.id;})
                .attr("class", function(){return "characterThumbnailBox";})
                .style("margin-bottom", characterSummaryBoxWidth*0.1 + "px")
                .style("width", (characterSummaryBoxWidth*0.8+6) + "px")
                .style("top", characterSummaryBoxWidth*0.1 + "px")
                .style("left", characterSummaryBoxWidth*0.1 + "px")
                .style("opacity", "0")
                .on("click", function(d, i){
                    var characterId = d3.event.srcElement.id.slice(18);
                    d3.select("#detailsWindowCloseButton").attr("eventId", "character"+characterId);
                    if(characterTable[characterId].image != "NULL") {
                        d3.select("#detailsWindowImage")
                            .style("height", "30vh")
                            .style("border", "3px groove #333333")
                            .style("background-image", "url(img/"+characterTable[characterId].image+")");
                    } else {
                        d3.select("#detailsWindowImage")
                            .style("height", "0")
                            .style("border", "0")
                            .style("background-image", "none");
                    }
                    d3.select("#detailsWindowTitle").html("");
                    d3.select("#detailsWindowSubTitle").html(characterTable[characterId].name);
                    d3.select("#detailsWindowDescription").html(characterTable[characterId].description);
                    d3.select("#detailsWindowGoToRegion").attr("location", characterTable[characterId].location);
                    $('#detailsModal').modal('show');
                });
            addedCharacter
                .append("div")
                .attr("id", "characterThumbnail"+characterData.id)
                .attr("class", "characterThumbnail " + characterData.culture)
                .style("height", characterSummaryBoxWidth*0.65 + "px")
                .style("width", characterSummaryBoxWidth*0.65 + "px")
                .style("background-image", "url(img/"+characterTable[i].image);
            addedCharacter
                .append("div")
                .attr("class", "characterLabel")
                .style("width", characterSummaryBoxWidth*0.65 + "px")
                .text(characterTable[i].name);
            addedCharacter
                .transition()
                .duration(1000)
                .ease("linear")
                .style("opacity", "1");
        }
    }
}