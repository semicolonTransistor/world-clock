import { DateTime } from "luxon";

function update_clock(clock, current_time) {
    let time_zone_name = clock.dataset.timeZone

    let time;
    if (time_zone_name !== null) {
        time = current_time.setZone(time_zone_name)
    } else {
        time = current_time
    }

    let fields = clock.querySelectorAll('.clock-field')
    for (let field of fields) {
        let fieldFormat = field.dataset.format
        if (fieldFormat !== null) {
            if (fieldFormat === "__difference") {
                let offset_difference = time.offset - current_time.offset
                if (offset_difference === 0) {
                    field.innerText = ""
                    continue
                }

                let behind = offset_difference < 0
                let abs_offset_difference = Math.abs(offset_difference)

                if (abs_offset_difference % 60 == 0) {
                    field.innerText = `${abs_offset_difference / 60} hours ${behind ? "behind" : "ahead"}`
                } else {
                    field.innerText = `${Math.floor(abs_offset_difference / 60)} hours and ${abs_offset_difference % 60} minutes ${behind ? "behind" : "ahead"}`
                }
            } else {
                field.innerText = time.toFormat(fieldFormat)
            }
        }

    }
}

function update_clocks(nextUpdate) {
    let currentTime = new Date()
    window.requestAnimationFrame(update_clocks)
    if (nextUpdate !== null && currentTime < nextUpdate) {
        return
    }

    nextUpdate = new Date(currentTime - currentTime.getMilliseconds() + 1000)

    currentTime = DateTime.now()
    let clocks = document.getElementsByClassName("clock")
    for (let clock of clocks) {
        update_clock(clock, currentTime)
    }
}

export function getClockTickerCallback() {
    let nextUpdate = null;

    return function() {
        update_clocks(nextUpdate)
    }
}

