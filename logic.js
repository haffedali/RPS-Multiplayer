//firebase
var config = {
    apiKey: "AIzaSyAk4RnQflpxASO7nYukDP2mYwTSoxXdq74",
    authDomain: "rps-multiplayer-f5841.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f5841.firebaseio.com",
    projectId: "rps-multiplayer-f5841",
    storageBucket: "",
    messagingSenderId: "167178315551"
  };
  firebase.initializeApp(config);
////////sessions
function storage(){
    sessionStorage.setItem('player1', 'no');
    sessionStorage.setItem('player2', 'no');
}
storage();


//Globals
var database = firebase.database();
var player1choice;
var player2choice;
var player1score = 0;
var player2score = 0;
var ties = 0;
var audience;
var timer = 10;
var battleRoomUsed = 'false';
var play1status = 'false';
var play2status = 'false';
var intervalId;
var count = 0;
var val = sessionStorage.getItem('player1');
var val2 = sessionStorage.getItem('player2');



//Data

database.ref("battleroom").set({
    isUsed: 'false',
    player1: 'false',
    player2: 'false',
})

database.ref("choices").set({
    player1choice: "wait",
    player2choice: "wait",
})

var battleRoomRef = database.ref("battleroom");
var choicesRef = database.ref("choices");
var connectionsRef = database.ref("/connections");

/// Data event listeners
battleRoomRef.on('value', function(snapshot) {
    play1status = snapshot.child("player1").val();
    play2status = snapshot.child("player2").val();
    battleRoomUsed = snapshot.child('isUsed').val(); 
    
});

choicesRef.on('value', function(snapshot) {
    player1choice = snapshot.child("player1choice").val();
    player2choice = snapshot.child('player2choice').val();
});

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});



//On click functions
$(".play1").on("click", function() {
    //if (val === "ready"){
        player1choice = this.value;
        console.log(player1choice);
        database.ref("choices").update({
            player1choice: player1choice,
        })
    //}
})
$(".play2").on("click", function() {
    //if (val2 === "ready"){
        player2choice = this.value;
        console.log(player2choice);
        database.ref("choices").update({
        player2choice: player2choice,
        })
    //}
});
$("#player-one-join").on("click", function() {
    battleRoomRef.update({
        player1: 'true',
    })
    if (val === "no"){
        sessionStorage.setItem("player1", "ready")
        console.log(val);
    }

    //var play1status = battleRoomRef.child('player1');
    if (play1status == 'true' && play2status == 'true'){
        battleRoomRef.update({
            isUsed: 'true',
        })
    }
});
$("#player-two-join").on("click", function(){
    battleRoomRef.update({
        player2: 'true',
    })
    if (val2 === "no"){
        sessionStorage.setItem("player2", "ready");
        console.log(val2);
    }
    if (play1status == 'true' && play2status == 'true'){
        battleRoomRef.update({
            isUsed: 'true',
        })
    }
});

$("#start").on("click", function(){
    if (battleRoomUsed === 'true') {
        timeStart();
    }
    else{
        clearInterval(intervalId);
    }
});
    



// functions
function rpsCheck() {
    switch(player1choice) {
        case "rock": 
            switch(player2choice) {
                case "rock":
                    ties += 1;
                    break;
                case "paper":
                    player2score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
                case "scissors":
                    player1score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
            }
            break;
        case "paper": 
            switch(player2choice) {
                case "rock":
                    player1score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
                case "paper":
                    ties += 1;
                    break;
                case "scissors":
                    player2score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
            };
            break;
        case "scissors": 
            switch(player2choice) {
                case "rock":
                    player2score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
                case "paper":
                    player1score += 1;
                    $(".score").html(player1score);
                    $(".score2").html(player2score);
                    break;
                case "scissors": 
                    ties += 1;
                    break;
            };
            break;

    }
}

// Timer Functions

function CountDown() {
    console.log('just workin');
    if (timer > 0){
        timer--;
        $("#timer").html(timer);
    }
    else {
        count++;
        rpsCheck();
        clearInterval(intervalId);
        console.log(player1score);
        if (count < 5) {
            timeStart();
        }
    }
}

function timeStart(){
    timer = 10;
    intervalId = setInterval(CountDown, 1000);
    
}


console.log(val);
console.log(val2);
////// if statement to start the game



