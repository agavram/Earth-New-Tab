function getJSON(url) {
    var resp;
    var xmlHttp;

    resp = "";
    xmlHttp = new XMLHttpRequest();

    if (xmlHttp != null) {
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        resp = xmlHttp.responseText;
    }
    return resp;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time;
    if (localStorage.getItem("showSec") === "true") {
        time = h + ":" + m + ":" + s + " " + session;
    } else {
        time = h + ":" + m + " " + session;
    }

    document.getElementById("ClockDisplay").innerText = time;
    document.getElementById("ClockDisplay").textContent = time;
}

showTime();
setInterval(showTime, 1000);

var gjson;
var links = [[]];

if (localStorage.getItem("lastFetch") === null || parseFloat(localStorage.getItem("lastFetch")) + 18000000 < + new Date()) {
    gjson = JSON.parse(getJSON("https://www.reddit.com/r/earthporn.json"));
    localStorage.setItem("lastFetch", + new Date());
    console.log("fetched")
    var index = 0;
    gjson.data.children.forEach(function (element) {
            if (!element.data.stickied && element.data.preview.images[0].source.width / element.data.preview.images[0].source.height > 1.3 && element.data.preview.images[0].source.width > 1400) {
                if (!links[index]) links[index] = []
                links[index][0] = element.data.url;
                links[index][1] = element.data.permalink;
                index++;
            }
    });
    localStorage.setItem("linksArr", JSON.stringify(links))
} else {
    links = JSON.parse(localStorage.getItem("linksArr"));
}

var rand = getRandomInt(1, links.length - 1);
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