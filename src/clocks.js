import { DateTime } from "luxon";
import { getTimeZones, rawTimeZones, timeZonesNames, abbreviations } from "@vvo/tzdb";

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
            field.innerText = time.toFormat(fieldFormat)
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

// build the city list
export const cities = new Map()
for (const timeZone of rawTimeZones) {
    console.log(timeZone)
    const timeZoneName = timeZone.name
    const countryCode = timeZone.countryCode

    for (const city of timeZone.mainCities) {
        const cityIdentifier = `${city}-${countryCode}`
        // console.log(city_identifier)
        cities.set(cityIdentifier, { city: city, countryCode: countryCode, timeZoneName: timeZoneName })
    }
}

export const timeZoneList = timeZonesNames