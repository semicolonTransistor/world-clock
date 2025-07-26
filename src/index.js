import _ from 'lodash';
import { DateTime } from "luxon";
// import Handlebars from "handlebars";

import defaultConfig from './default_config.json'
import './style.css';

var indexTemplate = require("./index.handlebars");



function component() {
    const element = document.createElement('div');
    element.innerHTML = indexTemplate({ clocks: defaultConfig.clocks })
    
    return element;
}
  
document.body.appendChild(component());

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

    console.log(next_update)

    current_time = DateTime.now()
    let clocks = document.getElementsByClassName("clock")
    for (let clock of clocks) {
        update_clock(clock, current_time)
    }
}

// setup animations
window.requestAnimationFrame(update_clocks)