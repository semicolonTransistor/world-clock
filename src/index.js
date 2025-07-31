import { DateTime } from "luxon";
// import Handlebars from "handlebars";

import './style.css';
import { getConfig } from './utils';

var indexTemplate = require("./index.handlebars");
import { getClockTickerCallback } from "./clocks";

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

// setup animations
window.requestAnimationFrame(getClockTickerCallback())