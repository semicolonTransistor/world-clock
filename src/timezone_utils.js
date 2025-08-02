import { getTimeZones, rawTimeZones, timeZonesNames, abbreviations } from "@vvo/tzdb";

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