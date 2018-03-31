
var config = {
    apiKey: "AIzaSyAO6TWSX5nTyex1G9-w6HezbC3qztgVABU",
    authDomain: "gt2018-mona.firebaseapp.com",
    databaseURL: "https://gt2018-mona.firebaseio.com",
    projectId: "gt2018-mona",
    storageBucket: "gt2018-mona.appspot.com",
    messagingSenderId: "420383055749"
};
firebase.initializeApp(config);


var database = firebase.database();
var name = "";
var destination = "";
var frequency = 0;
var firstTrain = "";
var minutesAway = 0;
var schedule = [];
var firstTrainTotalMin = 0;
var trainTime = 0;
var currentTimeTotalMin = 0;
var nextArrivalInMin = 0;
var nextArrival = "";


$("#submit-train").on("click", function() {

                                        event.preventDefault();

                                        name = $("#train-name").val().trim();
                                        firstTrain = $("#first-train").val().trim();
                                        destination = $("#destination").val().trim();
                                        frequency = $("#frequency").val().trim();


                                        convertCurrentTimeToMinutes();

                                        convertFirstTrainToMinutes(firstTrain);





    convertNextTrainToHoursMin(nextArrivalInMin);

    $("#train-name").val("");
    $("#first-train").val("");
    $("#destination").val("");
    $("#frequency").val("");


    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });

});


database.ref().on("child_added", function(snapshot) {


    $("#trains").append("<tr>" +
        "<th>" + snapshot.val().name + "</th>" +
        "<th>" + snapshot.val().destination + "</th>" +
        "<th>" + snapshot.val().frequency + "</th>" +
        "<th>" + snapshot.val().nextArrival + "</th>" +
        "<th>" + snapshot.val().minutesAway + "</th>" +
        "</tr>");
});


function convertFirstTrainToMinutes(firstTrain) {

    firstTrain = moment(firstTrain, "hh:mm");
    firstTrainHours = firstTrain.hours();
    firstTrainMin = firstTrain.minutes();


    firstTrainTotalMin = firstTrainMin + firstTrainHours*60;
}


function convertCurrentTimeToMinutes() {
    var currentHours = moment().hours();
    var currentMinutes = moment().minutes();


    currentTimeTotalMin = currentMinutes + currentHours*60;
}


function createTrainSchedule(firstTrainTotalMin, frequency) {

    trainTime = 0;
    schedule = [];
    for (var i = 0; trainTime < 24; i++) {
        trainTime = firstTrainTotalMin + (frequency*i);
        if (trainTime > 24) {
            return schedule;
        } else {
            schedule.push(trainTime);
        }
    }
};


function determineNextTrain(currentTimeTotalMin, schedule) {


    for (var i = 0; i < schedule.length; i++) {
        if (schedule[i] > currentTimeTotalMin) {
            nextArrivalInMin = schedule[i];
            return nextArrivalInMin;
        }
    }
}


function convertNextTrainToHoursMin(nextArrivalInMin) {
    var nextArrivalHours = Math.floor(nextArrivalInMin / 60);
    var ampm = "";


    if (nextArrivalHours > 12) {
        nextArrivalHours = nextArrivalHours - 12;
        ampm = "PM";
    } else {
        nextArrivalHours = nextArrivalHours;
        ampm = "AM";
    }
    var nextArrivalMin = nextArrivalInMin % 60;
    if (nextArrivalHours < 10) {
        nextArrivalHours = "0" + nextArrivalHours;
    }
    if (nextArrivalMin < 10) {
        nextArrivalMin = "0" + nextArrivalMin;
    }
    nextArrival = nextArrivalHours + ":" + nextArrivalMin + " " + ampm;
}



function determineMinutesAway(nextArrivalInMin, currentTimeTotalMin) {


    minutesAway = nextArrivalInMin - currentTimeTotalMin;

    return minutesAway;
}