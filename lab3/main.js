const btnStartRecording = document.getElementById("btn-start-recording");
let recording = false;
let trackNumber = 1;

document.addEventListener('keypress', (event) => {
    playSound(event.key);
});

function playSound(key) {
    switch (key) {
        case '1':
            var boom = new Audio('sounds/boom.wav');
            boom.currentTime = 0;
            boom.play();
            break;

        case '2':
            var clap = new Audio('sounds/clap.wav');
            clap.currentTime = 0;
            clap.play();
            break;

        case '3':
            var hihat = new Audio('sounds/hihat.wav');
            hihat.currentTime = 0;
            hihat.play();
            break;

        case '4':
            var kick = new Audio('sounds/kick.wav');
            kick.currentTime = 0;
            kick.play();
            break;

        case '5':
            var openhat = new Audio('sounds/openhat.wav');
            openhat.currentTime = 0;
            openhat.play();
            break;

        case '6':
            var ride = new Audio('sounds/ride.wav');
            ride.currentTime = 0;
            ride.play();
            break;

        case '7':
            var snare = new Audio('sounds/snare.wav');
            snare.currentTime = 0;
            snare.play();
            break;
        case '8':
            var tink = new Audio('sounds/tink.wav');
            tink.currentTime = 0;
            tink.play();
            break;

        case '9':
            var tom = new Audio('sounds/tom.wav');
            tom.currentTime = 0;
            tom.play();
            break;

        default:
            console.log(key);
    }  
}


let track1 = [];
let track2 = [];
let track3 = [];
let track4 = [];

function record(event) {
    if (!recording) return;
    const sound = {
        key: event.key,
        time: Date.now()
    };
   const trackName = eval("track"+ trackNumber);
    trackName.push(sound);
    console.log(track1)
}
function setRecording(number) {
    recording = true;
    if (number) {
        trackNumber = number;
    }
}
window.addEventListener('keypress', record);


function playBack(number){
let pauseTime;
const trackName = eval("track"+ number);
trackName.forEach(element => {
    if (element === trackName[0]) {
        pauseTime = element.time;   
    }
    if (element.key) {
        setTimeout(() => {
            playSound(element.key);
        }, element.time - pauseTime);
    }
console.log(pauseTime)
});


}

function playAll(){
playBack(1);
playBack(2);
playBack(3);
playBack(4);
}