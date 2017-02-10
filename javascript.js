// Global variables 
var firstKeyDown = true;
var isReady = false;
var levelComplete = false;
var isFirstButtonClick = true;
var isGameOver = false;
var students = [];
var announcement = new SpeechSynthesisUtterance("Please press either the up or down key to start the game.");

// Open link to UNC's main
// web page.
function linkToUNC() {
    window.open("http://www.unc.edu/", '_blank');
}

// Randomization functions
function randomLocation() {
    var location = [100, 200, 300, 400];
    var rand = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    return location[rand];
}

// The University of North Carolina 
// at Chapel Hill gets highlighted 
// blue when the user hovers over it. 
$(document).ready(function () {
    $("#newWindow").hover(
        function () {
            $("#newWindow").css({
                color: "#158BC5"
            });
        },
        function () {
            $("#newWindow").css({
                color: "#E04F5E"
            });
        });
});

// Detects a collision using 
// the distance forumula.
function collision(x, y) {
    var rX = parseInt($("#player").css("left"));
    var rY = parseInt($("#player").css("top"));

    var distance = Math.floor(Math.pow((Math.pow(y - rY, 2) + Math.pow(x - rX, 2)), 0.5));
    // The distance turns out to be off in the end
    // due to the differing positioning of the DOM
    // elements and their corresponding (x, y) 
    // locations. Therefore, a calibration factor
    // is used to obtain a reliable distance value.
    var calibrationFactor = 20;
    distance -= calibrationFactor;

    // If Rameses collides into 
    // a student. 
    if (distance < 35) {
        gameOver();
        isGameOver = true;
        return true;
    }
    return false;
}

// Checks whether or not a student
// is about to collide into Rameses. 
function isApproaching() {
    // Obtain (x,y) coordinate of Rameses.
    var rX = parseInt($("#player").css("left"));
    var rY = parseInt($("#player").css("top"));

    function col(x, y) {
        var distance = Math.floor(Math.pow((Math.pow(y - rY, 2) + Math.pow(x - rX, 2)), 0.5));
        var difference = Math.abs(rX - x - 25);
        //console.log("Difference: " + difference);

        // If Rameses is about to collide
        // into a student.
        if (distance < 180 && difference < 180) {
            return true;
        }
        return false;
    }

    // Howler object instantiated for
    // sound implementation.
    var sound = new Howl({
        urls: ["Ding.mp3"],
        autoplay: false,
        sprite: {
            ding: [0, 1000]
        },
        volume: 0.3
    });

    // Checks if a student is approaching 
    // Rameses, the main character. 
    for (var i = 0; i < students.length; i++) {
        var sX = students[i].x;
        var sY = students[i].y;
        var c = col(sX, sY);

        if ((rX > sX) && (c == true)) {
            sound.pos3d(-1, 0, 0, "id1");
            sound.play("ding");
            //console.log("Approaching from the left");
        } else if ((rX < sX) && (c == true)) {
            sound.pos3d(1, 0, 0, "id1");
            sound.play("ding");
            //console.log("Approaching from the right");
        }

        // What happens if there is a student
        // right in front of Rameses.
        var dY = Math.abs(rY - sY);
        if ((dY < 150) && (c == true)) {
            //
        }
    }
}

// Handles what happens after
// Rameses has collided into a 
// student, thus ending the game. 
var isFirstGameOver = true;

function gameOver() {
    // Hide Rameses from the game board.
    $("#player").hide();

    // Prevent Rameses from moving
    isReady = false;

    // Destroy student array references.
    for (var i = 0; i < students.length; i++) {
        students[i].remove();
        students.splice(i, 1);
    }

    // Announce that it is game over.
    if (isFirstGameOver == false) {
        return;
    }
    isFirstGameOver = false;

    var msg = new SpeechSynthesisUtterance();
    msg.text = "You have collided into a student! Game over. Please press the up or down key twice to play again.";
    speechSynthesis.speak(msg);

    // Game over div element which 
    // reads, "GAME OVER"
    var div = $("<div>");
    $(div).css({
        position: "absolute",
        left: "400px",
        top: "200px",
        width: "200px",
        height: "200px",
        backgroundColor: "#3B3B5A",
        border: "2px solid",
        borderRadius: "100px"
    });
    var text = $("<p>").text("GAME OVER");
    text.css({
        position: "absolute",
        fontSize: "30px",
        top: "50px",
        left: "15px",
        color: "#FFFFFF"
    });
    $(div).append(text);
    $(".gameboard").append(div);

    setTimeout(rel, 6000);

    function rel() {
        $(document).keydown(function (e) {
            switch (e.which) {
            case 38:
                location.reload();
                break;
            case 40:
                location.reload();
                break;
            }
        });
    }
}

// Controlling Rameses
$(document).keydown(function (e) {
    if (isReady == false) {
        return;
    }

    var jump = new Howl({
        urls: ["JUMP.mp3"],
        autoplay: false,
        sprite: {
            jump: [100, 650]
        },
        volume: 0.3
    });
    switch (e.which) {
        //    case 37: // left
        //        if (parseInt($("#player").css("left")) < 10) {
        //            return;
        //        }
        //        $("#player").animate({
        //            left: "-=20px"
        //        }, 70);
        //        break;
        //    case 39: // right
        //        if (parseInt($("#player").css("left")) > 930) {
        //            return;
        //        }
        //        $("#player").animate({
        //            left: "+=20px"
        //        }, 70);
        //        break;

    case 38: // up
        if (parseInt($("#player").css("top")) < 40) {
            levelComplete = true;
            finishLevel();
            return;
        }

        jump.play("jump");
        $("#player").animate({
            top: "-=20px"
        }, 70);

        break;
    case 40: // down
        if (parseInt($("#player").css("top")) > 510) {
            var howl = new Howl({
                urls: ["THUD.mp3"],
                autoplay: false,
                sprite: {
                    thud: [0, 800]
                }
            });
            howl.play("thud");
            return;
        }

        jump.play("jump");
        $("#player").animate({
            top: "+=20px"
        }, 70);
        break;
    }
    e.preventDefault();

    for (var i = 0; i < students.length; i++) {
        collision(students[i].x, students[i].y);
    }
});

// Clicking the button to begin 
// the game. 
$(document).ready(function () {
    // Initial annoucnement.
    speechSynthesis.speak(announcement);

    var temp = setInterval(function () {
        speechSynthesis.speak(announcement);
    }, 10000);

    var msg = new SpeechSynthesisUtterance("Thanks for choosing to play Cross the Heels. This game has one simple objective - to get Rameses across to the other side of the road without colliding into UNC students. Use the up and down keys to control Rameses. When you hear a ding sound in your left ear, that means you are being approached by a student from the left. If you hear a ding sound in your right ear, that means the student is moving away from you. Remember, the students can only move from the left side to the right side, and you can only move up and down. The students always start on the left side of the screen and move to the right of the screen. There are three levels to this game. Ready, get set, go!");

    $(document).keydown(function (e) {
        if (firstKeyDown == false) {
            return;
        }
        firstKeyDown = false;

        switch (e.which) {
        case 38:
            speechSynthesis.cancel(announcement);
            clearInterval(temp);
            $("#play").remove();
            //setTimeout(inner, 39000);
            //speechSynthesis.speak(msg);
            inner();
            break;
        case 40:
            speechSynthesis.cancel(announcement);
            clearInterval(temp);
            $("#play").remove();
            //setTimeout(inner, 39000);
            //speechSynthesis.speak(msg);
            inner();
            break;
        }

        function inner() {
            isReady = true;
            levelOne();
        }
    });

    $("#play").click(function () {
        if (isFirstButtonClick) {
            speechSynthesis.cancel(announcement);
            clearInterval(temp);
            firstKeyDown = false;
            $("#play").remove();
            //speechSynthesis.speak(msg);
            isFirstButtonClick = false;

            function inner() {
                isReady = true;
                levelOne();
            }
            inner();
            //setTimeout(inner, 39000);
        }
    });
});

// Used to move to the next
// level. 
function finishLevel() {
    // Move player back to the
    // initial spot.
    $("#player").css({
        left: "450px",
        top: "520px"
    });

    // Destroy student array references.
    for (var i = 0; i < students.length; i++) {
        students[i].remove();
    }

}

// Level 1
function levelOne() {
    // Announcer
    var msg = new SpeechSynthesisUtterance("Level 1");
    speechSynthesis.speak(msg);

    var secondOrGreaterSpawn = false;

    var lvl = $("<p>").text("LEVEL 1");
    $(lvl).css({
        fontSize: "40px",
        color: "black"
    });
    $(".gameboard").append(lvl);

    var student;

    function sprite() {
        student = $("<img src = 'student_1.png' class = 'students'>");
        if (secondOrGreaterSpawn) {
            student.css({
                top: "230px",
                left: "0px"
            });
        } else {
            student.css({
                top: "230px",
                left: randomLocation()
            });
        }
        student.x = parseInt($(student).css("left"));
        student.y = parseInt($(student).css("top"));

        $(".gameboard").append(student);
        students.push(student);
    }

    sprite();
    interval();

    // Movement of sprite.
    function interval() {
        var intervalID = setInterval(function () {

            if (isGameOver == true) {
                clearInterval(intervalID);
            }

            if (levelComplete) {
                student.remove();
                nextLevel();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student.x, student.y);
            $(student).animate({
                left: "+=20px"
            }, 70);
            student.x += 20;
            if (parseInt($(student).css("left")) > 930) {
                clearInterval(intervalID);
                student.remove();
                students.splice(0, 1);
                secondOrGreaterSpawn = true;
                sprite();
                interval();
            }
        }, 500);
    }

    function nextLevel() {
        for (var i = 0; i < students.length; i++) {
            students[i].remove();
            students.splice(i, 1);
        }
        levelComplete = false;
        levelTwo(lvl);
    }
}

// Level 2 
function levelTwo(lvl) {
    // Announcer
    var msg = new SpeechSynthesisUtterance("Level 2");
    speechSynthesis.speak(msg);

    lvl.text("LEVEL 2");

    var secondOrGreaterSpawn = false;
    var secondOrGreaterSpawn1 = false;

    var student;
    var student1;

    function sprite() {
        student = $("<img src = 'student_2.png' class = 'students'>");
        if (secondOrGreaterSpawn) {
            student.css({
                top: "330px",
                left: "0px"
            });
        } else {
            student.css({
                top: "330px",
                left: randomLocation()
            });
        }
        student.x = parseInt($(student).css("left"));
        student.y = parseInt($(student).css("top"));

        $(".gameboard").append(student);
        students.push(student);
    }

    function sprite1() {
        student1 = $("<img src = 'student_3.png' class = 'students'>");
        if (secondOrGreaterSpawn1) {
            student1.css({
                top: "130px",
                left: "0px"
            });
        } else {
            student1.css({
                top: "130px",
                left: randomLocation() + 200
            });
        }
        student1.x = parseInt($(student1).css("left"));
        student1.y = parseInt($(student1).css("top"));

        $(".gameboard").append(student1);
        students.push(student1);
    }

    sprite();
    sprite1();
    interval();
    interval1();

    // Movement of sprite.
    function interval() {
        var intervalID = setInterval(function () {
            if (isGameOver == true) {
                clearInterval(intervalID);
                student.remove();
            }

            if (levelComplete) {
                student.remove();
                nextLevel();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student.x, student.y);
            $(student).animate({
                left: "+=20px"
            }, 70);
            student.x += 20;

            if (parseInt($(student).css("left")) > 930) {
                clearInterval(intervalID);
                student.remove();
                students.splice(0, 1);
                secondOrGreaterSpawn = true;
                sprite();
                interval();
            }
        }, 500);
    }

    function interval1() {
        var intervalID = setInterval(function () {
            if (isGameOver == true) {
                student1.remove();
                clearInterval(intervalID);
            }

            if (levelComplete) {
                student1.remove();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student1.x, student1.y);
            $(student1).animate({
                left: "+=20px"
            }, 70);
            student1.x += 20;

            if (parseInt($(student1).css("left")) > 930) {
                clearInterval(intervalID);
                student1.remove();
                students.splice(1, 1);
                secondOrGreaterSpawn1 = true;
                sprite1();
                interval1();
            }
        }, 500);
    }

    function nextLevel() {
        for (var i = 0; i < students.length; i++) {
            students[i].remove();
            students.splice(i, 1);
        }
        levelComplete = false;
        levelThree(lvl)
    }
}

// Level 3
function levelThree(lvl) {
    // Announcer
    var msg = new SpeechSynthesisUtterance("Level 3");
    speechSynthesis.speak(msg);

    lvl.text("LEVEL 3");

    var secondOrGreaterSpawn = false;
    var secondOrGreaterSpawn1 = false;
    var secondOrGreaterSpawn2 = false;

    var student;
    var student1;
    var student2;

    function sprite() {
        student = $("<img src = 'student_2.png' class = 'students'>");
        if (secondOrGreaterSpawn) {
            student.css({
                top: "330px",
                left: "0px"
            });
        } else {
            student.css({
                top: "330px",
                left: randomLocation()
            });
        }
        student.x = parseInt($(student).css("left"));
        student.y = parseInt($(student).css("top"));

        $(".gameboard").append(student);
        students.push(student);
    }

    function sprite1() {
        student1 = $("<img src = 'student_3.png' class = 'students'>");
        if (secondOrGreaterSpawn1) {
            student1.css({
                top: "130px",
                left: "0px"
            });
        } else {
            student1.css({
                top: "130px",
                left: randomLocation() + 200
            });
        }
        student1.x = parseInt($(student1).css("left"));
        student1.y = parseInt($(student1).css("top"));

        $(".gameboard").append(student1);
        students.push(student1);
    }

    function sprite2() {
        student2 = $("<img src = 'student_4.png' class = 'students'>");
        if (secondOrGreaterSpawn2) {
            student2.css({
                top: "230px",
                left: "0px"
            });
        } else {
            student2.css({
                top: "230px",
                left: randomLocation() + 600
            });
        }
        student2.x = parseInt($(student2).css("left"));
        student2.y = parseInt($(student2).css("top"));

        $(".gameboard").append(student2);
        students.push(student2);
    }

    sprite();
    sprite1();
    sprite2();
    interval();
    interval1();
    interval2();

    // Movement of sprite.
    function interval() {
        var intervalID = setInterval(function () {
            if (isGameOver == true) {
                clearInterval(intervalID);
            }

            if (levelComplete) {
                student.remove();
                completeGame();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student.x, student.y);
            $(student).animate({
                left: "+=20px"
            }, 70);
            student.x += 20;

            if (parseInt($(student).css("left")) > 930) {
                clearInterval(intervalID);
                student.remove();
                students.splice(0, 1);
                secondOrGreaterSpawn = true;
                sprite();
                interval();
            }
        }, 500);
    }

    function interval1() {
        var intervalID = setInterval(function () {
            if (isGameOver == true) {
                clearInterval(intervalID);
            }

            if (levelComplete) {
                student1.remove();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student1.x, student1.y);
            $(student1).animate({
                left: "+=20px"
            }, 70);
            student1.x += 20;

            if (parseInt($(student1).css("left")) > 930) {
                clearInterval(intervalID);
                student1.remove();
                students.splice(1, 1);
                secondOrGreaterSpawn1 = true;
                sprite1();
                interval1();
            }
        }, 500);
    }

    function interval2() {
        var intervalID = setInterval(function () {
            if (isGameOver == true) {
                clearInterval(intervalID);
            }

            if (levelComplete) {
                student2.remove();
                clearInterval(intervalID);
            }

            isApproaching();

            collision(student2.x, student2.y);
            $(student2).animate({
                left: "+=20px"
            }, 70);
            student2.x += 20;

            if (parseInt($(student2).css("left")) > 930) {
                clearInterval(intervalID);
                student2.remove();
                students.splice(2, 1);
                secondOrGreaterSpawn2 = true;
                sprite2();
                interval2();
            }
        }, 500);
    }

    function completeGame() {
        // Prevent Rameses from 
        // moving. 
        isReady = false;

        // Destroy student array references.
        for (var i = 0; i < students.length; i++) {
            students[i].remove();
            students[i].splice(i, 1);
        }

        // Inform user that they have
        // completed the game.
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Congratulations! You have finished all three levels and have safely transported Rameses to the other side of the road. Press either the up or down key two times in a row to play again.";
        speechSynthesis.speak(msg);

        var div = $("<div>");
        $(div).css({
            position: "absolute",
            left: "400px",
            top: "200px",
            width: "200px",
            height: "200px",
            backgroundColor: "#3B3B5A",
            border: "2px solid",
            borderRadius: "100px"
        });
        var text = $("<p>").text("WINNER");
        text.css({
            position: "absolute",
            fontSize: "30px",
            top: "50px",
            left: "40px",
            color: "#FFFFFF"
        });
        $(div).append(text);
        $(".gameboard").append(div);

        setTimeout(reload, 11000);

        function reload() {
            speechSynthesis.cancel(msg);
            $(document).keydown(function (e) {
                switch (e.which) {
                case 38:
                    location.reload();
                    break;
                case 40:
                    location.reload();
                    break;
                }
            });
        }
    }
}