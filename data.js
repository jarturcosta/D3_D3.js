function distinct_teams(dataset) {
    var teams = new Set();
    for(var i=0; i < dataset.length; i++) {
        teams.add(dataset[i].homeTeam);
        teams.add(dataset[i].awayTeam);
    };
    return teams;
}

function distinct_seasons(dataset) {
    var seasons = new Set();
    for(var i=0; i < dataset.length; i++) {
        seasons.add(dataset[i].season);
    };
    return seasons;
}

function statsBySeasonByTeam(dataset) {
    var seasonKeys = Array.from(distinct_seasons(dataset));
    var teamKeys = Array.from(distinct_teams(dataset)).sort();
    var dataBySeason = {};
    for(var s=0; s < seasonKeys.length; s++) {
        dataBySeason[seasonKeys[s]] = {};
        for(var t=0; t < teamKeys.length; t++) {
            dataBySeason[seasonKeys[s]][teamKeys[t]] = {points: 0, goalsScored: 0, goalsConceded: 0, goalDifference: 0, position:0}
        };
    };
    for(var i=0; i < dataset.length; i++) {
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalsScored += parseInt(dataset[i].fullTimeHomeGoals)
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalsConceded += parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalDifference += parseInt(dataset[i].fullTimeHomeGoals) - parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalsConceded += parseInt(dataset[i].fullTimeHomeGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalsScored += parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalDifference += parseInt(dataset[i].fullTimeAwayGoals) - parseInt(dataset[i].fullTimeHomeGoals)
        if (dataset[i].fullTimeResult == "H"){
            dataBySeason[dataset[i].season][dataset[i].homeTeam].points += 3
        } else if (dataset[i].fullTimeResult == "A"){
            dataBySeason[dataset[i].season][dataset[i].awayTeam].points += 3
        } else {
            dataBySeason[dataset[i].season][dataset[i].homeTeam].points += 1
            dataBySeason[dataset[i].season][dataset[i].awayTeam].points += 1
        }
    };

    for (var i=0; i < seasonKeys.length; i++ ) {
        var seasonScores = Object.keys(dataBySeason[seasonKeys[i]]).map(function(key) {
            return [key, dataBySeason[seasonKeys[i]][key]["points"]];
        });

        seasonScores.sort(function(first, second) {
            return second[1] - first[1];
        });
        for (var y=0; y < seasonScores.length; y++ ) {
            dataBySeason[seasonKeys[i]][seasonScores[y][0]].position = y+1
        }
    }
    return dataBySeason;
}