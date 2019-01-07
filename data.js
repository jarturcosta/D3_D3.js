function distinct_teams(dataset) {
    var teams = new Set();
    for (var i = 0; i < dataset.length; i++) {
        teams.add(dataset[i].homeTeam);
        teams.add(dataset[i].awayTeam);
    }
    ;
    return teams;
}

function distinct_seasons(dataset) {
    var seasons = new Set();
    for (var i = 0; i < dataset.length; i++) {
        seasons.add(dataset[i].season);
    }
    ;
    return seasons;
}

function distinct_dates(dataset) {
    var dates = new Set();
    for (var i = 0; i < dataset.length; i++) {
        dates.add(formatDate(dataset[i].date));
    }
    ;
    return dates;
}

function statsBySeasonByTeam(dataset) {
    var seasonKeys = Array.from(distinct_seasons(dataset));
    var teamKeys = Array.from(distinct_teams(dataset)).sort();
    var dataBySeason = {};
    for (var s = 0; s < seasonKeys.length; s++) {
        dataBySeason[seasonKeys[s]] = {};
        for (var t = 0; t < teamKeys.length; t++) {
            dataBySeason[seasonKeys[s]][teamKeys[t]] = {
                points: 0,
                goalsScored: 0,
                goalsConceded: 0,
                goalDifference: 0,
                position: 0,
                wins: 0,
                losses: 0,
                draws: 0
            }
        }
        ;
    }
    ;
    for (var i = 0; i < dataset.length; i++) {
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalsScored += parseInt(dataset[i].fullTimeHomeGoals)
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalsConceded += parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].homeTeam].goalDifference += parseInt(dataset[i].fullTimeHomeGoals) - parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalsConceded += parseInt(dataset[i].fullTimeHomeGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalsScored += parseInt(dataset[i].fullTimeAwayGoals)
        dataBySeason[dataset[i].season][dataset[i].awayTeam].goalDifference += parseInt(dataset[i].fullTimeAwayGoals) - parseInt(dataset[i].fullTimeHomeGoals)
        if (dataset[i].fullTimeResult == "H") {
            dataBySeason[dataset[i].season][dataset[i].homeTeam].points += 3
            dataBySeason[dataset[i].season][dataset[i].homeTeam].wins += 1
            dataBySeason[dataset[i].season][dataset[i].awayTeam].losses += 1
        } else if (dataset[i].fullTimeResult == "A") {
            dataBySeason[dataset[i].season][dataset[i].awayTeam].points += 3
            dataBySeason[dataset[i].season][dataset[i].awayTeam].wins += 1
            dataBySeason[dataset[i].season][dataset[i].homeTeam].losses += 1
        } else {
            dataBySeason[dataset[i].season][dataset[i].homeTeam].points += 1
            dataBySeason[dataset[i].season][dataset[i].awayTeam].points += 1
            dataBySeason[dataset[i].season][dataset[i].awayTeam].draws += 1
            dataBySeason[dataset[i].season][dataset[i].homeTeam].draws += 1
        }
    }
    ;

    for (var i = 0; i < seasonKeys.length; i++) {
        var seasonScores = Object.keys(dataBySeason[seasonKeys[i]]).map(function (key) {
            return [key, dataBySeason[seasonKeys[i]][key]["points"]];
        });

        seasonScores.sort(function (first, second) {
            return second[1] - first[1];
        });
        for (var y = 0; y < seasonScores.length; y++) {
            dataBySeason[seasonKeys[i]][seasonScores[y][0]].position = y + 1
        }
    }
    return dataBySeason;
}

function teamsBySeason(dataset) {
    var stats = statsBySeasonByTeam(dataset);
    var teamsByS = {}
    var seasons = Object.keys(stats)
    for (var s = 0; s < seasons.length; s++) {
        teamsByS[seasons[s]] = Object.keys(stats[seasons[s]]).filter(function (o) {
                return stats[seasons[s]][o].wins + stats[seasons[s]][o].draws + stats[seasons[s]][o].losses > 0;
            }
        )
    }
    return teamsByS;
}

function tableByDate(input_data) {
    var dateKeys = Array.from(distinct_dates(input_data));
    var teamsByS = teamsBySeason(input_data);
    var dataByDate = {};
    var currentSeason = "";
    var currentTable = {};
    for (var i = 0; i < input_data.length; i++) {
        //console.log(currentTable, i);
        if (currentSeason != input_data[i].season) {
            currentTable = {}
            for (var t = 0; t < teamsByS[input_data[i].season].length; t++) {
                currentTable[teamsByS[input_data[i].season][t]] = {
                    position: 0,
                    name: teamsByS[input_data[i].season][t],
                    gamesPlayed: 0,
                    points: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsScored: 0,
                    goalsConceded: 0,
                    goalDifference: 0
                };
                console.log(currentTable[teamsByS[input_data[i].season][t]]);
            }
        }
        ;
        currentSeason = input_data[i].season;
        currentTable[input_data[i].homeTeam].goalsScored += parseInt(input_data[i].fullTimeHomeGoals)
        currentTable[input_data[i].homeTeam].goalsConceded += parseInt(input_data[i].fullTimeAwayGoals)
        currentTable[input_data[i].homeTeam].goalDifference += parseInt(input_data[i].fullTimeHomeGoals) - parseInt(input_data[i].fullTimeAwayGoals)
        currentTable[input_data[i].awayTeam].goalsConceded += parseInt(input_data[i].fullTimeHomeGoals)
        currentTable[input_data[i].awayTeam].goalsScored += parseInt(input_data[i].fullTimeAwayGoals)
        currentTable[input_data[i].awayTeam].goalDifference += parseInt(input_data[i].fullTimeAwayGoals) - parseInt(input_data[i].fullTimeHomeGoals)
        if (input_data[i].fullTimeResult == "H") {
            currentTable[input_data[i].homeTeam].points += 3
            currentTable[input_data[i].homeTeam].wins += 1
            currentTable[input_data[i].awayTeam].losses += 1
        } else if (input_data[i].fullTimeResult == "A") {
            currentTable[input_data[i].awayTeam].points += 3
            currentTable[input_data[i].awayTeam].wins += 1
            currentTable[input_data[i].homeTeam].losses += 1
        } else {
            currentTable[input_data[i].homeTeam].points += 1
            currentTable[input_data[i].awayTeam].points += 1
            currentTable[input_data[i].awayTeam].draws += 1
            currentTable[input_data[i].homeTeam].draws += 1
        }
        currentTable[input_data[i].awayTeam].gamesPlayed += 1
        currentTable[input_data[i].homeTeam].gamesPlayed += 1

        let tempMyObj = Object.assign({}, currentTable);
        dataByDate[formatDate(input_data[i].date)] = tempMyObj

    }
    ;

    for (var i = 0; i < dateKeys.length; i++) {
        var dateScores = Object.keys(dataByDate[dateKeys[i]]).map(function (key) {
            return [key, dataByDate[dateKeys[i]][key]["points"]];
        });

        dateScores.sort(function (first, second) {
            return second[1] - first[1];
        });
        for (var y = 0; y < dateScores.length; y++) {
            dataByDate[dateKeys[i]][dateScores[y][0]].position = y + 1
        }
    }
    return dataByDate;
}

function formatDate(date) {
    var d = ""
    if (date.split("/")[0].length < 2) {
        d += "0"
    }
    d += date.split("/")[0] + "/"
    if (date.split("/")[1].length < 2) {
        d += "0"
    }
    d += date.split("/")[1] + "/"
    if (parseInt(date.split("/")[2]) < 1000)
        d += parseInt(date.split("/")[2]) > 30 ? 19 : 20
    d += date.split("/")[2]
    return formatDate3(d)
}

function formatDate2(date) {
    return date.split("-")[2] + "/" + date.split("-")[1] + "/" + date.split("-")[0]
}

function formatDate3(date) {
    return date.split("/")[2] + "-" + date.split("/")[1] + "-" + date.split("/")[0]
}