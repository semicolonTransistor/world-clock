import { DateTime } from "luxon";
// import Handlebars from "handlebars";

import './style.css';
import { getConfig } from './utils';

var indexTemplate = require("./index.handlebars");

var config = getConfig()

// set theme
document.documentElement.dataset.theme = "dark"


function component() {
    const element = document.createElement('div');
    element.innerHTML = indexTemplate({ clocks: config.clocks })
    
    return element;
}
  
document.body.appendChild(component());

document.getElementById("navbar").classList.add("hiding")

// setup top-bar handler

var navbar_timeout = null

var navbar_close_delay = 5000;

function hide_navbar() {
    console.log("Hiding navbar")
    document.getElementById("navbar").style.top = "-100px"
    navbar_timeout = null
}

function set_hide_navbar_timeout() {
    console.log("Setting navbar timeout")
    if (navbar_timeout == null) {
        navbar_timeout = window.setTimeout(hide_navbar, navbar_close_delay)
    }
}

set_hide_navbar_timeout()

function clear_hide_navbar_timeout() {
    console.log("Clearing navbar timeout")
    if (navbar_timeout != null) {
        window.clearTimeout(navbar_timeout)
        navbar_timeout = null
    }
}

function show_navbar() {
    console.log("Showing navbar")
    document.getElementById("navbar").style.top = "0"
}


document.getElementById("navbar-trigger").onmouseenter = function() {
    if (navbar_timeout == null) {
        show_navbar()

        set_hide_navbar_timeout()
    }
}

document.getElementById("navbar").onmouseenter = function() {
    clear_hide_navbar_timeout()
}

document.getElementById("navbar").onmouseleave = function() {
    set_hide_navbar_timeout()
}



function update_clock(clock, current_time) {
    let time_zone_name = clock.getAttribute("data-timezone")


    let time;
    if (time_zone_name !== null) {
        time = current_time.setZone(time_zone_name)
    } else {
        time = current_time
    }

    let fields = clock.querySelectorAll('.clock-field')
    for (let field of fields) {
        let field_format = field.getAttribute("data-format")
        if (field_format !== null) {
            field.innerText = time.toFormat(field_format)
        }

    }
}

let next_update = null;

function update_clocks() {
    let current_time = new Date()
    window.requestAnimationFrame(update_clocks)
    if (next_update !== null && current_time < next_update) {
        return
    }

    next_update = new Date(current_time - current_time.getMilliseconds() + 1000)

    // console.log(next_update)

    current_time = DateTime.now()
    let clocks = document.getElementsByClassName("clock")
    for (let clock of clocks) {
        update_clock(clock, current_time)
    }
}

// setup animations
window.requestAnimationFrame(update_clocks)