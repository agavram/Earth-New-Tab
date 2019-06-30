function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const clock = document.getElementById("ClockDisplay");

function showTime() {
    var d = new Date();
    var s = checkTime(d.getSeconds());
    var m = checkTime(d.getMinutes());
    var h = checkTime(d.getHours());

    if (localStorage.getItem("showSec") === "true")
        clock.innerText = h + ":" + m + ":" + s;
    else
        clock.innerText = h + ":" + m;
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

// Call showTime() initially to make sure clock is instantly displayed
showTime();
setInterval(showTime, 1000);

var json;
var links = [[]];

if (localStorage.getItem("linksArr") === null || localStorage.getItem("lastFetch") === null || parseFloat(localStorage.getItem("lastFetch")) + 18000000 < + new Date()) {
    fetch("https://www.reddit.com/r/EarthPorn/top/.json?t=day").then(res => res.json())
        .then((json) => {
            localStorage.setItem("lastFetch", + new Date());
            console.log("fetched")
            var index = 0;
            json.data.children.forEach(function (element) {
                if (!element.data.stickied && element.data.preview.images[0].source.width / element.data.preview.images[0].source.height > 1.3 && element.data.preview.images[0].source.width > 1400) {
                    if (!links[index]) links[index] = []
                    let newURL = element.data.url;
                    if (newURL.includes("imgur")) {
                        newURL += ".jpg"
                    }
                    links[index][0] = newURL;
                    links[index][1] = element.data.permalink;
                    index++;
                }
            });
            localStorage.setItem("linksArr", JSON.stringify(links));
            displayImage();
        });
} else {
    links = JSON.parse(localStorage.getItem("linksArr"));
    displayImage();
}

function displayImage() {
    var rand = getRandomInt(0, links.length - 1);
    var url = links[rand][0];
    var img = document.getElementById("image");
    img.onload = function () {
        fade(img, document.getElementById("ClockDisplay"))
    }
    img.src = url;
    
    document.getElementById("reddit_link").href = "https://www.reddit.com" + links[rand][1];
    
    function fade(element, element2) {
        var op = 0.01; // initial opacity
        var timer = setInterval(function () {
            if (op >= 1.0) {
                clearInterval(timer);
                showTime();
            }
            element.style.opacity = op;
            element2.style.opacity = op;
            op = op + 0.05;
        }, 30);
    }
    
    document.onkeypress = function (e) {
        e = e || window.event
        if (e.key === 't') {
            localStorage.setItem("showSec", !(localStorage.getItem("showSec") === "true"))
            console.log(localStorage.getItem("showSec"))
            showTime()
        }
    }
}